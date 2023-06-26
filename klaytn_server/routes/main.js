const express = require('express')
const router = express.Router()

const mysql = require('mysql2')

const connection = mysql.createConnection(
    {
        host: process.env.host,
        port: process.env.port,
        user: process.env.user, 
        password: process.env.password, 
        database: process.env.database 
    }
)

// kip7.js 로드 
const token = require("../token/kip7.js")

module.exports = function(){
    // 기본 경로? localhost:3000/

    router.get("/", function(req, res){
        // session.logined에 데이터가 존재하지 않는다면 login.ejs 보여준다
        if(!req.session.logined){
            res.render('login.ejs')
        }else{
            res.redirect('/main')
        }
    })

    // 회원가입 페이지로 이동하는 api 생성
    router.get('/signup', function(req, res){
        res.render('signup.ejs')
    })

    // 유저가 입력한 정보를 mysql 에 삽입
    router.post('/signup', async function(req, res){
        // 유저가 입력한 정보를 변수에 대입, 확인
        const input_phone = req.body._phone
        const input_pass = req.body._pass
        console.log(input_phone, input_pass)
        // kip7.js에 있는 지갑을 생성하는 함수를 호출
        const wallet = await token.create_wallet()
        console.log(wallet)

        // DB에 데이터를 삽입
        const sql = `
            insert 
            into 
            user 
            values 
            (?, ?, ?)
        `
        const values = [input_phone, input_pass, wallet]

        connection.query(
            sql, 
            values, 
            function(err, result){
                if(err){
                    console.log(err)
                    res.send(err)
                }else{
                    console.log(result)
                    res.redirect("/")
                }
            }
        )
    })

    // 로그인 api
    router.post('/signin', function(req, res){
        // 유저가 보낸 데이터를 변수에 대입, 확인
        const input_phone = req.body._phone
        const input_pass = req.body._pass
        console.log(input_phone, input_pass)

        // mysql 데이터와 비교
        const sql = `
            select 
            * 
            from 
            user 
            where 
            phone = ? 
            and 
            password = ?
        `
        const values = [input_phone, input_pass]

        connection.query(
            sql, 
            values, 
            function(err, result){
                if(err){
                    console.log(err)
                    res.send(err)
                }else{
                    // 로그인이 성공하는 조건?
                    // result는 배열이고 해당하는 배열의 길이가 0이 아닌 경우
                    if(result.length != 0){
                        // session 데이터를 저장
                        req.session.logined = result[0]
                    }
                    res.redirect("/")
                }
            }
        )
    })

    router.get('/main', function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            console.log(req.session)
            res.render('main.ejs')
        }
    })

    router.get('/info', async function(req, res){
        // 로그인을 한 지갑의 토큰의 양을 로드 
        // kip7.js에 있는 balance_of() 함수를 호출
        if(!req.session.logined){
            res.redirect('/')
        }else{
            const wallet = req.session.logined.wallet
            console.log(wallet)
            const balance = await token.balance_of(wallet)
            console.log(balance)
            res.render('info.ejs', {
                // 유저의 phone, wallet, 토큰의 양
                'user' : req.session.logined, 
                'balance' : balance
            })
        }
    })

    return router
}
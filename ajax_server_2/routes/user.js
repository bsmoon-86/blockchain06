const express = require('express')

const router = express.Router()

const mysql = require('mysql2')

const connection = mysql.createConnection({
    host : process.env.host, 
    port : process.env.port, 
    user : process.env.user, 
    password : process.env.password, 
    database : process.env.database
})

module.exports = function(){

    router.get('/', function(req, res){
        res.render('login')
    })

    router.get('/signup', function(req, res){
        res.render('signup')
    })

    router.post('/check_id', function(req, res){
        // 비동기 통신으로 들어온 데이터를 변수에 대입 및 확인
        const input_id = req.body._id
        console.log(input_id)

        // 유저에게 보내줄 데이터 변수를 미리 선언
        let data

        // 유저가 보낸 id가 데이터베이스에 존재하는지 확인
        const sql = `
            select 
            * 
            from 
            user_info
            where 
            id = ?
        `
        const values = [input_id]
        connection.query(
            sql, 
            values, 
            async function(err, result){
                if(err){
                    console.log(err)
                    // 에러 발생시 위에서 미리 선언한 변수에 'Error' 를 대입
                    data = 'Error' 
                    res.json({
                        'data' : data
                    })
                }else{
                    if(result.length == 0){
                        // 유저가 입력한 id값이 사용 가능한 경우
                        // 미리 선언한 변수에 'Able'을 대입
                        data = 'Able'
                        res.json({
                            'data' : data
                        })
                    }else{
                        // 유저가 입력한 id 값이 데이터베이스에 존재하는 경우 (id 사용 불가)
                        // 미리 선언한 변수에 'Disable'을 대입
                        data = 'Disable'
                        res.json({
                            'data' : data
                        })
                    }
                }
            }
        )
    })

    router.post('/signup', function(req, res){
        // 유저가 보낸 데이터를 변수에 대입 및 확인
        const input_id = req.body._id
        const input_pass = req.body._pass
        const input_name = req.body._name
        console.log(input_id, input_pass, input_name)

        // 입력받은 데이터를 데이터베이스에 삽입
        // /check_id와 비동기 통신으로 사용할 수 있는 id 값만 넘어오기때문에 insert 작업을 바로 사용 가능
        const sql = `
            insert 
            into 
            user_info 
            values 
            (?, ?, ?)
        `
        const values = [input_id, input_pass, input_name]

        connection.query(
            sql, 
            values, 
            function(err, result){
                if(err){
                    console.log(err)
                    res.send(err)
                }else{
                    console.log(result)
                    // 데이터 삽입이 정상적으로 완료되면 로그인 화면으로 돌아간다. 
                    res.redirect('/')
                }
            }
        )
    })

    return router
}
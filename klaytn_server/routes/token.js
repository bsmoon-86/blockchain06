// express 로드 
const express = require('express')
const router = express.Router()

// kip7.js 로드 
// 해당하는 파일의 경로에서 kip7.js를 로드하려면
// 상위 폴더 이동 -> token 하위폴더 이동 -> kip7.js
const token = require('../token/kip7.js')

module.exports = function(){
    // api를 생성
    // token.js 파일의 기본 경로는 localhost:3000/token

    router.get("/", function(req, res){
        res.render('create_token.ejs')
    })

    // 토큰을 발행하는 api 
    // localhost:3000/token/create [get]
    router.get('/create', async function(req, res){
        // 유저가 보낸 데이터를 변수에 대입, 확인
        const input_name = req.query._name
        const input_symbol = req.query._symbol
        const input_decimal = Number(req.query._decimal)
        const input_amount = Number(req.query._amount)
        console.log(
            input_name, 
            input_symbol, 
            input_decimal, 
            input_amount
        )
        const receipt = await token.create_token(
            input_name, 
            input_symbol, 
            input_decimal, 
            input_amount
        )
        console.log(receipt)
        res.send(receipt)
    })

    // 로그인을 한 유저의 지갑에 토큰을 거래하는 api 
    router.get('/charge', async function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            // 유저가 보낸 데이터를 변수에 대입, 확인
            const input_amount = Number(req.query._amount)
            console.log(input_amount)

            const wallet = req.session.logined.wallet
            console.log(wallet)
    
            // kip7.js에 있는 transfer() 호출
            const receipt = await token.transfer(wallet, input_amount)
            console.log(receipt)
            res.redirect("/")

        }
    })

    return router
}
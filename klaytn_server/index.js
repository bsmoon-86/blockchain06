// express 로드 
const express = require('express')
const app = express()

// port 번호 설정
const port = 3000

// view 파일들의 기본 경로 설정
app.set('views', __dirname+"/views")
// view engine 설정
app.set('view engine', 'ejs')

// post 방식으로 들어오는 데이터를 json형태로 변환
app.use(express.urlencoded({extended:false}))

// dotenv 설정
require('dotenv').config()

// express-session 모듈 로드 
const session = require('express-session')
// session 설정
app.use(
    session(
        {
            secret : process.env.secret, 
            resave : false, 
            saveUninitialized : false, 
            cookie : {
                maxAge : 60000 // 1000당 1초
            }
        }
    )
)

const main = require('./routes/main.js')()
app.use("/", main)

const token = require('./routes/token.js')()
app.use("/token", token)



const server = app.listen(port, function(){
    console.log(port, 'Server Start')
})
// express 모듈을 로드 
const express = require('express')
const app = express()
// 웹서버의 port 번호를 지정 
const port = 3000

// 뷰 파일들의 기본 경로 설정 
// __dirname : 현재 파일의 경로
app.set('views', __dirname+'/views')
// 뷰 파일의 엔진을 어떤것을 사용할 것인가 지정
app.set('view engine', 'ejs')

// app.use(express.json())
// extened false를 사용하게 되면 데이터 변환하는 엔진 qs 모듈을 사용(express 내장)
// extened true를 사용하게 되면 데이터 변환하는 엔진 querystring 모듈을 사용
// (구버전 express에는 내장되어 있지 않는다. 별도의 설치가 필요)
app.use(express.urlencoded({extended:false}))


// 기본 경로 localhost:3000
// api 생성 

// localhost:3000/ 요청이 들어오면 
app.get("/", function(req, res){
    // req 매개변수는 유저가 서버에게 요청을 보내는 부분
    // res 매개변수는 서버가 유저에게 응답을 보내는 부분
    // res.send('Hello World')
    // ejs 파일을 응답 
    res.render('main')
})

// localhost:3000/second
app.get("/second", function(req, res){
    // res.send('Second Page')
    res.render('data')
})

// localhost:3000/data 주소 생성
app.get("/data", function(req, res){
    // get 형식으로 데이터를 보내면 
    // req안에 query라는 키값 안에 데이터들이 존재
    // console.log(req.query)
    const input_id = req.query._id
    const input_pass = req.query._pass
    console.log(input_id, input_pass)
    res.send(req.query)
})

// localhost:3000/data2 post 형식으로 주소 생성
app.post("/data2", function(req, res){
    // post 형식으로 데이터를 보낼때는 req 안에 body 안에 데이터가 존재
    console.log(req.body)
    // res.send(req.body)
    // 유저가 입력한 id 값이 test이고 password가 1234인 경우 로그인 성공
    // 그 외의 경우에는 로그인 실패
    const input_id = req.body._id
    const input_pass = req.body._pass
    console.log(input_id, input_pass)
    let result
    if ((input_id == 'test') & (input_pass == '1234')){
        result = '로그인 성공'        
    }else{
        result = '로그인 실패'
    }
    res.render('index', {
        data : result
    })
})

app.get('/third', function(req, res){
    res.send('Third Page')
})


// 웹 서버의 시작
app.listen(port, function(){
    console.log('server start')
})


/* 

    DB 에서 서버에게 데이터를 보내는 형태 
    result = [
        {
            id : 'test', 
            pass : '1234', 
            name : 'moon', 
            phone : '01011112222'
        }, 
        {
            id : 'test2', 
            pass : '1111', 
            name : 'kim', 
            phone : '01099998888'
        }, .....
    ]

    kim이라는 단어만 추출하려면?

    result[1] = {
            id : 'test2', 
            pass : '1111', 
            name : 'kim', 
            phone : '01099998888'
        }
    result[1]['name']
    result[1].name
*/
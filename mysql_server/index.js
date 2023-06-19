// express 로드 
const express = require('express')
const app = express()
const port = 3000

// view 파일의 기본 경로 설정 
app.set('views', __dirname+"/views")
// view engine 지정 
app.set('view engine', 'ejs')

// post 데이터를 받는 경우에 json형태로 데이터 변환
app.use(express.urlencoded({extended:false}))

// dotenv를 이용하여 환경변수 설정
require('dotenv').config()

// mysql2 라이브러리 로드 
const mysql = require('mysql2')
// mysql server 정보를 입력하여 연결
const connection = mysql.createConnection({
    host : process.env.host, 
    port : process.env.port, 
    user : process.env.user, 
    password : process.env.password, 
    database : process.env.database
})
console.log(process.env.host)

// localhost:3000 요청이 들어오는 경우
app.get('/', function(req, res){
    res.render('login')
})

// localhost:3000/signup [get]
app.get('/signup', function(req, res){
    const data = req.query.result
    console.log(data)
    let output = 0
    if (data){
        output = data
    }
    res.render('signup', {
        data : output
    })
})

// localhost:3000/signup2 [post]
app.post('/signup2', function(req, res){
    // 유저가 입력한 데이터를 변수에 대입 & 확인
    const input_id = req.body._id
    const input_pass = req.body._pass
    const input_name = req.body._name
    const input_age = req.body._age
    const input_loc = req.body._loc
    console.log(input_id, input_pass, input_name, input_age, input_loc)

    const sql = `
        insert 
        into 
        user_info 
        values 
        (?, ?, ?, ?, ?)
    `
    const values = [input_id, input_pass, input_name, input_age, input_loc]

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

// localhost:3000/check_id [get]
app.get('/check_id', function(req, res){
    // 유저가 입력한 데이터를 변수에 대입 & 확인
    const input_id = req.query._id
    console.log(input_id)

    const sql = `
        select 
        * 
        from 
        user_info 
        where 
        id = ?
    `
    const values = [input_id]
    // connection을 이용하여 mysql server에 sql쿼리문을 실행
    connection.query(
        sql, 
        values, 
        function(err, result){
            if(err){
                console.log(err)
                res.send(err)
            }else{
                if (result.length == 0){
                    res.render('signup2', {
                        data : input_id
                    })
                }else{
                    res.redirect("/signup?result=false")
                }
            }
        }
    )
})

// locslhost:3000/login [post]
app.post('/login', function(req, res){
    // 유저가 보낸 데이터를 변수에 대입 & 확인
    const input_id = req.body._id
    const input_pass = req.body._pass
    console.log(input_id, input_pass)

    // mysql의 user_info table에서 유저가 입력한 데이터가 존재하는가?
    const sql = `
        select 
        * 
        from 
        user_info 
        where 
        id = ? 
        and 
        password = ?
    `
    const values = [input_id, input_pass]
    connection.query(
        sql, 
        values, 
        function(err, result){
            if(err){
                console.log(err)
                res.send(err)
            }else{
                // mysql에서 express서버에 결과물의 데이터형태가 
                /* 데이터가 존재하는 경우
                    [
                    {
                        'id': xxxx, 
                        'password' : xxxx, 
                        'name':xxxxx, 
                        'age':xxx, 
                        'loc':xxxx}, 
                        ....
                    ]
                    데이터가 존재하지 않는 경우
                    []
                */
               if(result.length == 0){
                res.redirect("/")
               }else{
                res.redirect('/board')
               }
            }
        }
    )
})

// localhost:3000/board [get]
app.get('/board', function(req, res){
    res.render('board')
})

// localhost:3000/add_content [get]
app.get('/add_content', function(req, res){
    res.render('add_content')
})

// localhost:3000/add_content2 [post]
app.post('/add_content2', function(req, res){
    // 유저가 입력한 데이터를 변수에 대입 & 확인
    const input_title = req.body._title
    const input_content = req.body._content
    console.log(input_title, input_content)

    const sql = `
        insert 
        into 
        board(
            title, 
            content
        )
        values (
            ?, ?
        )
    `
    const values = [input_title, input_content]

    connection.query(
        sql, 
        values, 
        function(e, result){
            if(e){
                console.log(e)
                res.send(e)
            }else{
                console.log(result)
                res.redirect('/board')
            }
        }
    )
})

// server 실행
const server = app.listen(port, function(){
    console.log('Server Start')
})
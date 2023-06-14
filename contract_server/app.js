// express 로드 
const express = require('express')
const app = express()

const port = 3000

// view 파일들의 기본 경로 설정
app.set('views', __dirname+'/views')
// view engine 설정
app.set('view engine', 'ejs')

// post형태로 데이터가 들어오는 경우 json형태로 변경
app.use(express.urlencoded({extended:false}))

// localhost:3000/ 요청 들어오는 경우 
app.get("/", function(req, res){
    res.render('login.ejs')
})

// 회원가입 페이지를 보여주는 주소 생성 
app.get('/signup', (req, res)=>{
    res.render('signup.ejs')
})

app.post('/signup2', function(req, res){
    // post 형태에서 데이터가 존재하는 곳은? req.body.(key)
    const input_id = req.body._id
    const input_pass = req.body._pass
    const input_name = req.body._name
    const input_age = req.body._age
    console.log(input_id, input_pass, input_name, input_age)
    res.send('signup2')
})

app.listen(port, function(){
    console.log('server start')
})
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

// contract의 정보가 담겨있는 json파일을 로드 
const contract_info = require("./build/contracts/Test.json")
const contract_abi = contract_info.abi
const contract_address = contract_info.networks['5777'].address
console.log(contract_address)

// 컨트렉트가 배포된 네트워크 등록
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(
    'http://127.0.0.1:7545'
))

// 배포한 컨트렉트의 주소와 abi를 이용하여 컨트렉트 로드 
const smartcontract = new web3.eth.Contract(
    contract_abi, 
    contract_address
)




// localhost:3000/ 요청 들어오는 경우 
app.get("/", function(req, res){
    res.render('login.ejs')
})

// 회원가입 페이지를 보여주는 주소 생성 
app.get('/signup', (req, res)=>{
    res.render('signup.ejs')
})

// 로그인 관련 주소를 생성 
app.post('/signin', function(req, res){
    // 유저가 보낸 데이터를 변수에 대입 
    const input_id = req.body._id
    const input_pass = req.body._pass
    console.log(input_id, input_pass)

    // smartcontract를 이용하여 해당하는 아이디가 존재하는지 체크 
    // 데이터가 존재한다면 유저가 입력한 password와 데이터의 password 값을 비교
    // 두 값이 같다면 로그인 성공
    // 그 외의 경우는 로그인 실패
    smartcontract
    .methods
    .view_user(input_id)
    .call()
    .then(function(result){
        // result는 {'0':password, '1':name, '2':age}
        // 로그인이 성공하는 조건 
        // result['0'] == input_pass 그리고 result['0'] != ""
        if((result['0'] == input_pass) & (result['0'] != "")){
            res.render('index.ejs', {
                'name' : result['1']
            })
        }else{
            res.redirect("/")
        }
    })
})



app.post('/signup2', function(req, res){
    // post 형태에서 데이터가 존재하는 곳은? req.body.(key)
    const input_id = req.body._id
    const input_pass = req.body._pass
    const input_name = req.body._name
    const input_age = req.body._age
    console.log(input_id, input_pass, input_name, input_age)
    // res.send('signup2')
    smartcontract
    .methods
    .add_user(
        input_id, 
        input_pass, 
        input_name, 
        input_age
    )
    .send(
        {
            gas : 200000, 
            from : '0xDF4568438cbAC4237932D747d23e7DB514c38282'
        }
    )
    .then(function(receipt){
        console.log(receipt)
        res.redirect('/')
    })
})

// 등록된 유저의 정보를 확인하는 페이지
app.get('/user_list', async function(req, res){
    // count 값을 로드
    const count = await smartcontract
                    .methods
                    .view_count()
                    .call()
    // [] 값을 로드 
    const user_list = await smartcontract
                    .methods
                    .view_list()
                    .call()
    // 배열의 데이터들을 하나씩 뽑아서 contract 안에 있는 view_user()에 넣어준다. 
    // 결과값을 새로운 배열 데이터에 추가 
    let result = new Array()
    for (var i = 0; i < count; i++){
        let _id = user_list[i]
        let data = await smartcontract
                    .methods
                    .view_user(_id)
                    .call()
        data['id'] = _id
        result.push(data)
    }

    /* 
    result -> [
        {'0':password, '1':name, '2':age, 'id':id}, .......
    ]
    */ 
   res.render('user_list.ejs', {
    'data' : result
   })
})

app.listen(port, function(){
    console.log('server start')
})
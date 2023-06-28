// express 로드 
const express = require('express')
// Route() 함수를 변수에 대입
const router = express.Router()

// moment 모듈 로드 
const moment = require('moment')

// baobab network에 배포한 컨트렉트를 연동하기위한 모듈을 로드 
const Caver = require('caver-js')
// 컨트렉트의 정보 로드 
const contract_info = require('../build/contracts/board.json')

// baobab네트워크 주소를 입력 
const caver = new Caver("https://api.baobab.klaytn.net:8651")

// 배포된 컨트렉트를 연동
const smartcontract = new caver.klay.Contract(
    contract_info.abi, 
    contract_info.networks['1001'].address
)

// 수수료를 지불할 지갑을 등록 
const account = caver.klay.accounts.createWithAccountKey(
    process.env.public_key, 
    process.env.private_key
)

caver.klay.accounts.wallet.add(account)

module.exports = function(){
    // 해당하는 파일의 api의 기본 경로 : localhost:3000/contract

    // localhost:3000/contract 요청시 
    // 등록된 게시글의 목록
    router.get("/", async function(req, res){
        // contract를 이용하여 저장된 모든 데이터를 로드 
        // 저장된 데이터의 갯수를 확인하는 함수를 호출
        const contents_len = await smartcontract
                            .methods
                            .view_content_no()
                            // view함수는 수수료가 발생하지 않는다.
                            // 수수료를 낼 지갑의 정보가 필요하지 않다. 
                            .call()
        console.log(contents_len)
        // 비어 있는 배열을 하나 생성
        const data = new Array()
        for(let i = 0; i < contents_len; i++){
            // view_content() 함수를 호출해서 
            // return 받은 결과값을 data라는 비어있는 배열에 push
            const result = await smartcontract
                            .methods
                            .view_content(i)
                            .call()
            data.push(result)
        }
        console.log(data)
        res.render('content_list.ejs', {
            'data' : data
        })
    })

    // 글의 내용을 추가할수 잇는 페이지
    // localhost:3000/contract/add [get]
    router.get('/add', function(req, res){
        res.render('add_content.ejs')
    })

    // 글의 내용들을 contract를 이용하여 저장하는 api
    // localhost:3000/contract/add2 [post]
    router.post('/add2', async function(req, res){
        // 유저가 보낸 데이터를 변수에 대입, 확인
        const input_title = req.body._title
        const input_content = req.body._content
        const input_writer = account.address
        const input_image = req.body._image
        console.log(input_title, input_content, input_writer, input_image)
        // 현재 시간이 필요
        let date = moment()
        const create_dt = date.format("YYYY-MM-DD HH:mm")
        console.log(create_dt)

        // smartcontract에 있는 함수를 호출하여 데이터를 저장
        const receipt = await smartcontract
                        .methods
                        .add_content(
                            input_title, 
                            input_content, 
                            input_writer, 
                            input_image, 
                            create_dt
                        )
                        .send(
                            {
                                from : account.address, 
                                gas : 2000000
                            }
                        )
        console.log(receipt)
        res.redirect("/contract")
    })


    return router
}
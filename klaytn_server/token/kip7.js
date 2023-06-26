// caver-js-ext-kas 모듈을 로드 
const CaverExtKAS = require("caver-js-ext-kas")
// class 생성
const caver = new CaverExtKAS()
// fs 모듈 로드
const fs = require('fs')
// dotenv 로드 (환경변수 설정)
require('dotenv').config()

// KAS에 접속하기위한 ID, PASSWORD의 파일을 로드 
const kas_info = require('./kas.json')
console.log(kas_info)
// accesskeyID 변수 , secretAccessKey 생성
const accesskeyID = kas_info.accessKeyId
const secretAccessKey = kas_info.secretAccessKey
// testnet의 chainid 지정
const chainid = 1001
console.log(accesskeyID, secretAccessKey)

// 생성자 함수 호출 
caver.initKASAPI(chainid, accesskeyID, secretAccessKey)

// KAS에서 외부의 지갑을 사용하기 위해선 지갑 등록
const keyringContainer = new caver.keyringContainer()
const keyring = keyringContainer.keyring.createFromPrivateKey(
    process.env.private_key
)
keyringContainer.add(keyring)

async function create_token(_name, _symbol, _decimal, _amount){
    const kip7 = await caver.kct.kip7.deploy(
        {
            name : _name,               //토큰의 이름
            symbol : _symbol,           //토큰의 심볼
            decimals : _decimal,         //토큰의 소수점 자리수
            initialSupply : _amount     //토큰의 초기 발행량
        }, 
        keyring.address, 
        keyringContainer
    )
    const addr = kip7._address
    console.log(addr)
    // 토큰의 주소 값을 json 파일 안에 대입
    const kip7_address = {
        address : addr
    }
    // json을 문자형을 변환
    const data = JSON.stringify(kip7_address)
    // JSON 파일의 형태로 저장
    fs.writeFileSync('./token/kip7.json', data)
    return '토큰 발행 완료'
}

// create_token('block_test', 'BT', 0, 1000000)

// 토큰을 거래하는 함수 선언
async function transfer(_address, _amount){
    // 발행한 토큰을 wallet 추가 
    const token_info = require('./kip7.json')
    const kip7 = await new caver.kct.kip7(token_info.address)
    kip7.setWallet(keyringContainer)

    const receipt = await kip7.transfer(
        _address, 
        _amount, 
        {
            from : keyring.address
        }
    )
    console.log(receipt)
    return "토큰 거래 완료"
}

// console.log(transfer('0xd52863320168D36402EFb31b36515D723656258D', 100))

// 유저가 토큰 발행자에게 토큰을 보내는 함수 (transaction의 주체자가 발행자)
async function transfer_from(_private, _amount){
    // 발행한 토큰을 wallet 추가 
    const token_info = require('./kip7.json')
    console.log(token_info.address)
    const kip7 = await new caver.kct.kip7(token_info.address)
    kip7.setWallet(keyringContainer)

    // 토큰 발행자의 지갑 주소
    const owner = keyring.address
    console.log(owner)


    // 유저의 지갑 주소를 keyringContainer 등록
    const keyring2 = keyringContainer.keyring.createFromPrivateKey(
        _private
    )
    keyringContainer.add(keyring2)
    console.log(keyring2.address)

    // approve() 함수를 호출 : 내 지갑에 있는 일정 토큰을 다른 사람이 이동 시킬수 있도록 권리를 부여
    // approve(권한을 받을 지갑의 주소, 토큰의 양, from)
    await kip7.approve(
        owner, 
        _amount, 
        {
            from : keyring2.address
        }
    )

    const receipt = await kip7.transferFrom(
        keyring2.address, 
        owner, 
        _amount, 
        {
            from : owner
        }
    )
    console.log(receipt)

    return "토큰 이동 완료"
}

// transfer_from(
//     '0x1b02d2bb3012f7218e90d336a935bd919d0741a5814252d51cf5c337984f2192', 
//     10)

async function balance_of(_address){
    const token_info = require('./kip7.json')
    const kip7 = await new caver.kct.kip7(token_info.address)
    kip7.setWallet(keyringContainer)

    const balance = await kip7.balanceOf(_address)

    console.log(balance)
    return balance
}
// balance_of('0xd52863320168D36402EFb31b36515D723656258D')

// 지갑을 생성 하는 함수 선언
async function create_wallet(){
    const wallet = await caver.kas.wallet.createAccount()
    console.log(wallet)
    return wallet.address
}

module.exports = {
    create_token, transfer, transfer_from, balance_of, create_wallet
}
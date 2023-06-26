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
    fs.writeFileSync('kip7.json', data)
    return '토큰 발행 완료'
}

create_token('block_test', 'BT', 0, 1000000)

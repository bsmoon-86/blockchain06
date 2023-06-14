// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract Test {
    // 변수 선언
    address internal owner;
    uint internal count;

    // 구조체 선언
    struct user_info{
        string password;
        string name;
        uint8 age;
    }

    // 생성자 함수
    // 컨트렉트 배포가 될 때 최초로 한번만 실행되는 함수
    constructor(){
        //  msg.sender는 deploy를 하는 지갑의 주소
        owner = msg.sender;
        count = 0;
    }

    // mapping 데이터를 생성 
    mapping (string => user_info) internal users;

}
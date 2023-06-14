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

    // 배열 데이터를 생성 
    string[] internal user_list;

    // 구조체를 이용하여 배열을 생성 
    user_info[] public user_list2;


    // modifier
    modifier onlyOwner{
        require(msg.sender == owner, "Only owner can call function");
        _;
    }

    modifier increament{
        _;
        count++;
    }

    // 유저의 정보를 users mapping에 대입
    function add_user(
        string memory _id, 
        string memory _pass, 
        string memory _name, 
        uint8 _age
    ) public onlyOwner {
        // require(msg.sender == owner, "only owner can call function");
        // mapping 데이터에 매개변수의 값들은 대입
        users[_id].password = _pass;
        users[_id].name = _name;
        users[_id].age = _age;
    }

    // 유저의 정보를 출력하는 함수 
    function view_user(
        string memory _id
    ) public view returns (
        string memory, 
        string memory, 
        uint8
    ){
        return (
            users[_id].password, 
            users[_id].name, 
            users[_id].age
        );
    }
} 
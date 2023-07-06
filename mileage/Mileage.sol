// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.0;

contract Mileage {

    address internal owner;

    // 컨트렉트 배포자를 오너로 등록
    constructor(){
        owner = msg.sender;
    }

    // 마일리지 mapping 데이터 생성
    mapping(address => uint) internal mileage;
    // 등록된 유저가 맞는지 체크하는 mapping 데이터 생성
    mapping(address => bool) internal exists;
    // 등록된 유저들의 목록 배열 생성
    address[] internal users;

    // 오너만이 함수를 실행할 수 있도록 modifier 생성
    modifier onlyOwner{
        require(msg.sender == owner, "Only the owner can execute the function");
        _;
    }
    // 등록된 유저만이 마일리지를 받거나 거래할 수 있도록 modifier 생성
    modifier checkUser(
        address _address
    ){
        require(exists[_address], "You are an unregistered user.");
        _;
    }

    // 회원의 정보를 등록하는 함수
    function add_user(
        address _address
    ) public onlyOwner{
        // 등록 유저를 체크하는 mapping 데이터가 false인 경우에만 유저를 등록하고 mapping의 value를 true로 변경
        if(!exists[_address]){
            users.push(_address);
            exists[_address] = true;
        }
    }

    // 마일리지를 추가하는 함수
    // 오너만이 함수 실행이 호출이 가능하고 등록된 유저여야만 마일리지 추가가 가능
    function add_mileage(
        address _address, 
        uint _amount
    ) public onlyOwner checkUser(_address){
            mileage[_address] += _amount;
    }

    // 마일리지는 거래하는 함수
    // 오너만이 함수 실행이 호출이 가능하고 등록된 유저여야만 마일리지 교환이 가능
    // sender가 보유한 마일리지가 _amount보다 커야 교환이 가능
    function trans_milage(
        address _sender, 
        address _receiver, 
        uint _amount
    ) public onlyOwner checkUser(_sender) checkUser(_receiver){
        require(mileage[_sender] >= _amount, "Not enough mileage");
        mileage[_sender] -= _amount;
        mileage[_receiver] += _amount;
    }

    // 마일리지를 조회하는 함수
    // 오너만이 함수 호출이 가능하고 등록된 유저여야 마일리지 조회가 가능
    function view_mileage(
        address _address
    ) public onlyOwner checkUser(_address) view returns (
        uint
    ) {
        return mileage[_address];
    }

    // 유저의 리스트를 확인하는 함수
    // 오너만이 함수 호출 가능
    function view_users() public onlyOwner view returns(address[] memory){
        return users;
    }


}
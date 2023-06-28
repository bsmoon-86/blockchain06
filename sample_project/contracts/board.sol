// SPDX-License-Identifier: MIT
pragma solidity = 0.8.19;

contract board{

    // owner 주소 변수 선언
    address internal owner;
    // 글번호 초기 변수 
    uint internal content_no;

    // 구조체 생성 
    struct content_info{
        string title;
        string content;
        address writer;
        string image;
        string create_dt;
    }

    // mapping 변수 생성
    mapping (uint => content_info) internal contents;

    // deploy가 될때 최초로 한번만 실행이 되는 함수 (초기화 함수)
    constructor(){
        owner = msg.sender;
        content_no = 0;
    }

    // modifier 함수 : 함수에 추가적인 행동을 지정할때 사용 
    modifier onlyOwner{
        require(msg.sender == owner, "Only owner can call function");
        _;
    }

    modifier inceament{
        _;
        content_no++;
    }

    // 게시판에 글을 추가하는 함수 생성
    function add_content(
        string memory _title, 
        string memory _content, 
        address _writer,
        string memory _image, 
        string memory _create_dt
    ) public onlyOwner inceament {
        // mapping data에 값들을 추가한다. 
        contents[content_no].title = _title;
        contents[content_no].content = _content;
        contents[content_no].writer = _writer;
        contents[content_no].image = _image;
        contents[content_no].create_dt = _create_dt;
    }

    // 글의 번호를 출력하는 함수 
    function view_content_no() public view returns(uint){
        return (content_no);
    }

    // 구조체를 리턴하는 함수 생성
    function view_content(
        uint _no
    ) public view returns(
        string memory, 
        string memory, 
        address, 
        string memory, 
        string memory
    ){
        string memory title = contents[_no].title;
        string memory content = contents[_no].content;
        address writer = contents[_no].writer;
        string memory image = contents[_no].image;
        string memory create_dt = contents[_no].create_dt;
        return (title, content, writer, image, create_dt);
    }


}
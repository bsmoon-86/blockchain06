// 일반함수 선언
function func_1(){
    console.log("Hello World")
}

// 함수를 호출
func_1()

// 매개변수가 존재하는 함수 선언
function func_2(a, b){
    console.log(a)
    console.log(b)
    result = a ** b 
    return result
}

console.log(func_2(5,3))

// 매개변수가 존재 기본값 지정 함수
function func_3(a, b = 2){
    result = a + b 
    return result
}

console.log(func_3(3, 5))
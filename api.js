window.onload = () => {
    console.log("로딩되었음")
}

async function handleSignin(){
    // email과 password를 변경 불가능한 객체로 지정하고 값 받아오기
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    console.log(email, password)

    // async와 await으로 해당 반응이 올때까지 대기 signup이 오면 content-type을 json형식으로 받아서
    // body부분을 JSON.stringify json글씨 형식으로 바꿔서 post한다
    const response = await fetch('http://127.0.0.1:8000/users/signup/', {
        headers:{
            'content-type':'application/json',
        },
        method:'POST',
        body: JSON.stringify({
            "email":email,
            "password":password
        })
    })

    console.log(response)

}

async function handleLogin(){
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const response = await fetch('http://127.0.0.1:8000/users/api/token/', {
        headers:{
            'content-type':'application/json',
        },
        method:'POST',
        body: JSON.stringify({
            "email":email,
            "password":password
        })
    })

    // 인터넷 콘솔에 나오는 body의 response부분을 json형식으로 변경
    const response_json = await response.json()
    console.log(response_json)

    // 페이지>어플리케이션>로컬스토리지에 저장하는 방법 앞에가 key 뒤에가 value(토큰값,리프레시값 저장)
    localStorage.setItem("access", response_json.access);
    localStorage.setItem("refresh", response_json.refresh);

    //.로 나누고 2번째인 body=payload부분을 가져온다
    const base64Url = response_json.access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    //jsonpayload부분을 글자로 바꿔서
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c){
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    //loaclstorage에 다시 저장
    localStorage.setItem("payload", jsonPayload);

}

//Bearer 오른쪽에 한칸 꼭 띄어쓰기!!
async function handleMock(){
    const response = await fetch('http://127.0.0.1:8000/users/mock/', {
        headers:{
            "Authorization" : "Bearer " + localStorage.getItem("access")
        },
        method:'GET',
    })

    console.log(response)

}

function handleLogout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
} 
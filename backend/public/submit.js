
function sendRequest(){
  fetch("http://localhost:5000/login", {
    method: 'POST',
    headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({username:document.getElementById('username').value, password:document.getElementById('password').value})
    }).then(res => {
        if (res.ok) return res.json();
        return res.json().then(res => {throw new Error(res.error)})
    }).then((res)=>{
      window.localStorage.setItem('refreshToken', res.refreshToken)
      document.write("Logged in successfully")
    }).catch((error)=>{
        console.log(error);
    })
}


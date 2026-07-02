const user = JSON.parse(localStorage.getItem("user"));

const userDisplay = document.getElementById("userDisplay");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

if(user){

    if(userDisplay){
        userDisplay.innerHTML =
            `Halo, ${user.username}`;
    }

    if(loginBtn){
        loginBtn.style.display = "none";
    }

    if(registerBtn){
        registerBtn.style.display = "none";
    }

    if(logoutBtn){
        logoutBtn.style.display = "inline-block";
    }

}

if(logoutBtn){

    logoutBtn.addEventListener("click",()=>{

        localStorage.removeItem("user");

        window.location.href = "login.html";

    });

}
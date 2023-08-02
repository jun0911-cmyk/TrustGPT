import Login from "./modules/login.module.js";

const loginBTN = document.getElementById("login-button");

loginBTN.addEventListener("click", async () => {
    const id = document.getElementById("login-id").value;
    const pw = document.getElementById("login-pw").value;

    const login = new Login(id, pw);
    const result = await login.loginSend();

    if (result.status == 200) {
        document.getElementById('login-popup').classList.remove('active');
    } else {
        console.log("failure");
    }
});
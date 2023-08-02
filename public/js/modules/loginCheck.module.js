import Request from "./request.module.js";

const request = new Request();

request.setURL("/auth/check");
request.setMethod("GET");

const result = await request.send();

if (result.isLogin != true) {
    const loginPopup = document.getElementById('login-popup');

    if (loginPopup) {
        loginPopup.classList.add('active');
    }
}
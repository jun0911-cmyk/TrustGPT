import Request from "./request.module.js";

export default class Login {
    constructor (id, pw) {
        this.id = id;
        this.pw = pw;
    }

    async loginSend() {
        const request = new Request();

        if (this.id && this.pw) {
            request.setURL("/auth/login");
            request.setMethod("POST");
            request.setBody({ username: this.id, password: this.pw });
            request.setHeader({ "Content-Type": "application/json" });
                
            return await request.send();
        }
    }
}
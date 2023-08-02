import Request from "./request.module.js";

export default class Signup {
    constructor (id, email, pw) {
        this.id = id;
        this.email = email;
        this.pw = pw;
    }

    async signupSend() {
        const request = new Request();

        if (this.id && this.email && this.pw) {
            request.setURL("/auth/signup");
            request.setMethod("POST");
            request.setBody({ username: this.id, email: this.email, password: this.pw });
            request.setHeader({ "Content-Type": "application/json" });
                
            return await request.send();
        }
    }
}
import Request from "./request.module.js";

export default class Chat {
    constructor (message) {
        this.message = message;
    }

    async chatSend() {
        const request = new Request();

        if (this.message) {
            request.setURL("/gpt/chat");
            request.setMethod("POST");
            request.setBody({ message: this.message });
            request.setHeader({ "Content-Type": "application/json" });
                
            return await request.send();
        }
    }
}
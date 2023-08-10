import Request from "./request.module.js";

export default class Vote {
    constructor (link) {
        this.link = link;
    }

    async voteSend() {
        const request = new Request();

        if (this.link) {
            request.setURL("/vote/");
            request.setMethod("POST");
            request.setBody({ link: this.link });
            request.setHeader({ "Content-Type": "application/json" });
                
            return await request.send();
        }
    }
}
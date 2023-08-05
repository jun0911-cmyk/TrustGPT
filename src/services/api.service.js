const Logger = require("../middlewares/log.middleware.js");
const RequestService = require("./request.service.js");

const logger = new Logger();
const defaultURL = "http://127.0.0.1:3000";

module.exports = class APIService {
    constructor() {}

    async pingTest() {
        const requestService = new RequestService();
        const result = await requestService
                        .setURL(defaultURL + "/api/v1/ping")
                        .setMethod("GET")
                        .send();

        if (result.data == "PONG") {
            return "Local Server Running";
        } else {
            return "Shut Downed Local Server.";
        }
    }

    async getWord(gptObj) {
        const requestService = new RequestService();
        const result = await requestService
                        .setURL(defaultURL + "/api/v1/word")
                        .setMethod("POST")
                        .setBody(gptObj)
                        .setHeader({ "Content-Type": "application/json" })
                        .send();

        if (result.data != "API request ERROR...") {
            return result.data;
        } else {
            return null;
        }
    }

    async getKeyword(gptObj) {
        const requestService = new RequestService();
        const result = await requestService
                        .setURL(defaultURL + "/api/v1/keyword")
                        .setMethod("POST")
                        .setBody(gptObj)
                        .setHeader({ "Content-Type": "application/json" })
                        .send();

        if (result.data != "API request ERROR...") {
            return result.data;
        } else {
            return null;
        }
    }
}
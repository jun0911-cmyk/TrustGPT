const axios = require("axios");
const Logger = require("../middlewares/log.middleware.js");

const logger = new Logger();

module.exports = class RequestService {
    constructor () {
        this.url = "";
        this.body = "";
        this.header = "";
        this.method = "";
    }

    setURL(url) {
        this.url = url;
        
        return this;
    }

    setMethod(method) {
        this.method = method;

        return this;
    }

    setBody(body) {
        this.body = body;

        return this;
    }

    setHeader(header) {
        this.header = header;

        return this;
    }

    async send() {
        try {
            if (this.method == "GET") {
                return await axios.get(this.url);
            } 
            
            else if (this.method == "POST") {
                let config = {
                    headers: this.header
                };
    
                return await axios.post(this.url, this.body, config);
            }
        } catch (err) {
            logger.errorLog("RequestService, API Request Error : " + err);

            return null;
        }
    }
}
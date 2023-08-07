const Logger = require("../middlewares/log.middleware.js");
const RequestService = require("../services/request.service.js");
const env = require("dotenv");

env.config({ path: __dirname + "../config/.env" });

const logger = new Logger();

module.exports = class SearchService {
    constructor() {}

    isQueryValidate(query) {
        if (query.length > 1000) return false;
        if (typeof query != "string") return false;
        if (query.indexOf("\n") != -1) return false;

        return true;
    }

    async search(query) {
        const API_KEY = process.env.GOOGLE_SEARCH_API;
        const CX = process.env.GOOGLE_SEARCH_CX;
        const URL = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${query}`;

        const requestService = new RequestService();
        
        try {
            const response = await requestService
                            .setURL(URL)
                            .setMethod("GET")
                            .send();

            return response.data.items;
        } catch (err) {
            logger.errorLog("Google Custom Search API Error : " + err);

            return null;
        }
    }
}
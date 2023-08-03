const fs = require("fs");
const path = require("path");
const Logger = require("../middlewares/log.middleware.js");

const logger = new Logger();

module.exports = class HistoryService {
    constructor() {}

    async chatHistory(id) {
        const filepath = path.join(__dirname, "../chat/" + id + ".json");
        const isExist = await fs.existsSync(filepath);

        if (isExist) {
            return filepath;
        } else {
            return null;
        }
    }

    async updateHistory(prompt, messageObj) {
        try {
            prompt.push(messageObj);

            const promptJSON = JSON.stringify(prompt);

            await fs.writeFileSync(filename, promptJSON);

            return true;
        } catch (err) {
            logger.errorLog("prompt history update error : " + err);
            
            return false;
        }
    }
}
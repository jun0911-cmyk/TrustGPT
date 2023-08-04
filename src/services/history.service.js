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
            return {
                isExistBool: true,
                filepath,
            };
        } else {
            return {
                isExistBool: false,
                filepath,
            };
        }
    }

    async updateHistory(filename, prompt, messageObj) {
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

    async getChatHistory(id) {
        const exist = await this.chatHistory(id);
        
        if (exist.isExistBool == true) {
            const filepath = exist.filepath;
            const dataBuffer = await fs.readFileSync(filepath);
            const dataJSON = dataBuffer.toString();

            return dataJSON;
        } else {
            return null;
        }
    }
}
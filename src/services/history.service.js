const fs = require("fs");
const path = require("path");
const Logger = require("../middlewares/log.middleware.js");
const idGenerator = require("../middlewares/idGenerate.middleware.js");
const uuidv4 = require("uuid4");

const logger = new Logger();

module.exports = class HistoryService {
    constructor() {}

    async chatHistory(id, chatID) {
        const filename = id + "_" + chatID + ".json";
        const filepath = path.join(__dirname, "../chat/" + filename);
        const isExist = await fs.existsSync(filepath);

        if (isExist) {
            return {
                isExistBool: true,
                chat_id: chatID,
                filepath,
            };
        } else {
            const new_chatID = idGenerator(uuidv4());
            const new_filename = id + "_" + new_chatID + ".json";
            const new_filepath = path.join(__dirname, "../chat/" + new_filename);

            return {
                isExistBool: false,
                chat_id: new_chatID,
                filepath: new_filepath,
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

    async getChatHistory(id, chatID) {
        let chat_id = "";

        if (chatID) {
            chat_id = idGenerator(chatID);
        }

        const exist = await this.chatHistory(id, chat_id);
        
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
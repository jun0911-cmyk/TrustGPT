const Logger = require("../middlewares/log.middleware.js");
const fs = require("fs");
const path = require("path");

const logger = new Logger();

module.exports = class SummaryService {
    constructor () {
        this.prompt = [];
    }

    async setSystemPrompt() {
        const promptFilename = "prompt.json";
        const promptPath = path.join(__dirname, "../chat/summary/" + promptFilename);
        const dataBuffer = await fs.readFileSync(promptPath);
        const dataJSON = dataBuffer.toString();
        const parseJSON = JSON.parse(dataJSON);

        this.prompt = parseJSON;

        return this.prompt;
    }

    async getSummaryPrompt(message) {
        const prompt = await this.setSystemPrompt();

        if (prompt[0]["role"] == "user") {
            this.prompt.push({
                role: "user",
                content: message,
            });

            return this.prompt;
        } else {
            return null;
        }
    }
}
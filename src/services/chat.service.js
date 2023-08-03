const openai = require("../config/gpt.config.js");
const Logger = require("../middlewares/log.middleware.js");
const fs = require("fs");
const path = require("path");

const loggger = new Logger();

module.exports = class ChatService {
    constructor(username, message) {
        this.message = message;
        this.username = username;
    }

    isNone() {
        if (this.message) return false;
        else return true;
    }

    isValidateFormat(gptOutput) {
        try {
            const suggestions = JSON.parse(gptOutput);
            if (!_.isArray(suggestions)) return false;
            if (suggestions.length < 5) return false;
            const isAllStrings = suggestions.every(_.isString);
            if (!isAllStrings) return false;
            return true;
        } catch (error) {
            loggger.errorLog("GPT message Validate Error : " + error);

            return false;
        }
    }

    firstChatPrompt() {
        const systemPrompt = {
            role: "system", "content": "You are a helpful assistant",
        };

        const userPrompt = {
            role: "user", "content": this.message,
        };

        const prompt = [systemPrompt, userPrompt];

        return prompt;
    }

    async chatPrompt(filename) {
        const dataBuffer = await fs.readFileSync(filename);
        const dataJSON = dataBuffer.toString();
        const parseJSON = JSON.parse(dataJSON);

        let prompt = parseJSON;

        prompt.push({ role: "user", content: this.message });

        return prompt;
    }

    async sendChat(prompt) {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-16k-0613",
            messages: prompt,
        });

        const gpt = response.data.choices[0].message
        const gptMessage = gpt.content;
        const gptRole = gpt.role;

        if (this.isValidateFormat(gptMessage)) {
            return { role: gptRole, content: gptMessage };
        } else {
            return null;
        }
    }
}
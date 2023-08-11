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
            if (typeof gptOutput != "string") return false;
            if (gptOutput.length < 5) return false;
            return true;
        } catch (error) {
            loggger.errorLog("GPT message Validate Error : " + error);

            return false;
        }
    }

    firstChatPrompt() {
        const systemPrompt = {
            role: "system", content: "You are a helpful assistant.",
        };

        const userPrompt = {
            role: "user", content: this.message,
        };

        const prompt = [systemPrompt, userPrompt];

        return prompt;
    }

    generateMessage(words, message) {
        let generate_messages = [];
        let result_message = "";

        for (let i = 0; i < words.words.length; i++) {
            const word = words.words[i].sent;

            generate_messages.push({
                word: word, 
                generateWord: "<p class='emphasis'>" + word + "</p>",
            });
;       }

        for (let j = 0; j < generate_messages.length; j++) {
            const generate_message = generate_messages[j];

            if (result_message == "") {
                result_message = message.content.replaceAll(generate_message.word + ". ", generate_message.generateWord);
            } else {
                result_message = result_message.replaceAll(generate_message.word + ".", generate_message.generateWord);
            }
        }

        return {
            role: "assistant",
            content: result_message
        };
    }

    async chatPrompt(filepath) {
        const dataBuffer = await fs.readFileSync(filepath);
        const dataJSON = dataBuffer.toString();
        const parseJSON = JSON.parse(dataJSON);

        let prompt = parseJSON;

        prompt.push({ role: "user", content: this.message });

        return prompt;
    }

    async sendChat(prompt) {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-16k",
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
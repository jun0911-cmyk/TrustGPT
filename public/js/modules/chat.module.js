import Request from "./request.module.js";

let messageCount = 0;

export default class Chat {
    constructor (message) {
        this.message = message;
    }

    async chatSend() {
        const request = new Request();
        const chatID = location.search.split("=")[1];

        if (this.message) {
            request.setURL("/gpt/chat?chatID=" + chatID);
            request.setMethod("POST");
            request.setBody({ message: this.message });
            request.setHeader({ "Content-Type": "application/json" });
                
            return await request.send();
        }
    }

    async getHistory() {
        const request = new Request();
        const chatID = location.search.split("=")[1];

        request.setURL("/gpt/history?chatID=" + chatID);
        request.setMethod("GET");
            
        return await request.send();
    }

    async summary(words, keywords, userMessage) {
        const request = new Request();
        const chatID = location.search.split("=")[1];

        request.setURL("/gpt/summary?chatID=" + chatID);
        request.setMethod("POST");
        request.setBody({ 
            words: words, 
            keywords: keywords, 
            userMessage: userMessage 
        });

        request.setHeader({ "Content-Type": "application/json" });

        return await request.send();
    }

    async search(queryArray) {
        const request = new Request();
        const chatID = location.search.split("=")[1];

        request.setURL("/gpt/search?chatID=" + chatID);
        request.setMethod("POST");
        request.setBody({ 
            search: queryArray, 
        });

        request.setHeader({ "Content-Type": "application/json" });

        return await request.send();
    }

    addMessage(message, messageContainer) {
        const gptMessage = message.content;

        messageCount += 1;

        messageContainer.innerHTML += `<p>assistant : <chat id="${messageCount}"></chat></p>`;

        const messageBox = document.getElementById(messageCount);

        messageBox.innerHTML = gptMessage;
    }
}
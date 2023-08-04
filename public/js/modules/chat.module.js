import Request from "./request.module.js";

let messageCount = 0;

export default class Chat {
    constructor (message) {
        this.message = message;
    }

    async chatSend() {
        const request = new Request();

        if (this.message) {
            request.setURL("/gpt/chat");
            request.setMethod("POST");
            request.setBody({ message: this.message });
            request.setHeader({ "Content-Type": "application/json" });
                
            return await request.send();
        }
    }

    async getHistory() {
        const request = new Request();

        request.setURL("/gpt/history");
        request.setMethod("GET");
            
        return await request.send();
    }

    addMessage(message, messageContainer) {
        const gptMessage = message.content;

        messageCount += 1;

        messageContainer.innerHTML += `<p>assistant : <chat id="${messageCount}"></chat></p>`;

        const messageBox = document.getElementById(messageCount);

        messageBox.innerText = gptMessage;
    }
}
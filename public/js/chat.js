import Chat from "./modules/chat.module.js";

const sendBtn = document.getElementById("send-button");
const messageContainer = document.getElementById("chat-messages");

document.addEventListener("DOMContentLoaded", async () => {
    const history = new Chat();
    const historyResult = await history.getHistory();
    
    if (historyResult.isHistory) {
        const jsonHistory = JSON.parse(historyResult.history);

        for (let i = 1; i < jsonHistory.length; i++) {
            messageContainer.innerHTML += `<p>${jsonHistory[i].role} : ${jsonHistory[i].content}</p>`
        }
    }
});

sendBtn.addEventListener("click", async () => {
    const message = document.getElementById("chat-input").value;
    const messageBox = document.getElementById("chat-input");

    messageBox.value = "";
    messageContainer.innerHTML += `<p>user : ${message}</p>`;

    const chat = new Chat(message);
    const result = await chat.chatSend();

    if (result.isMessage) {
        chat.addMessage(result.message, messageContainer);
    } else {
        console.log("failure");
    }
})
import Chat from "./modules/chat.midule.js";

const sendBtn = document.getElementById("send-button");

sendBtn.addEventListener("click", async () => {
    const message = document.getElementById("chat-input").value;

    const chat = new Chat(message);
    const result = await chat.chatSend();

    if (result.status == 200) {
        console.log(result.message);
    } else {
        console.log("failure");
    }
})
import Chat from "./modules/chat.module.js";

const sendBtn = document.getElementById("send-button");
const messageContainer = document.getElementById("chat-messages");
const historyContainer = document.getElementById("history-list");
const searchContainer = document.getElementById("chat-search");

$("#chat-search").hide();

document.addEventListener("DOMContentLoaded", async () => {
    const history = new Chat();
    const historyResult = await history.getHistory();

    if (historyResult.historyList) {
        for (let j = 0; j < historyResult.historyList.length; j++) {
            const history_data = historyResult.historyList[j];

            const historyDIV = document.createElement("div");
            
            historyDIV.id = history_data["chatID"];
            historyDIV.innerText = history_data["title"];

            historyContainer.appendChild(historyDIV);
        }
    }
    
    if (historyResult.history) {
        const jsonHistory = JSON.parse(historyResult.history);

        for (let i = 1; i < jsonHistory.length; i++) {
            messageContainer.innerHTML += `<p>${jsonHistory[i].role} : ${jsonHistory[i].content.replaceAll("\n", "</br>")}</p>`
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
        history.pushState({}, "", "/?chatID=" + result.chat_id);
        chat.addMessage(result.message, messageContainer);

        const summaryResult = await chat.summary(result.words, result.keywords, message);
        
        if (!summaryResult.isSummaryed) {
            console.log("failure");

            return null;
        }

        const queryArray = summaryResult.summaryKeyword;
        const searchResult = await chat.search(queryArray);

        if (searchResult.search) {
            $("#chat-search").show();
            
            searchContainer.innerHTML = "";

            Object.keys(searchResult.search).forEach((key) => {
                const searchData = searchResult.search[key];
    
                for (let i = 0; i < searchData.length; i++) {
                    const searchObj = searchData[i];

                    searchContainer.innerHTML += `
                    <iframe id="${searchObj.link}" src="${searchObj.link}" frameborder="1" style="width: 100%; height: 40%; border: 2px solid black;" class="sitemapIframe"></iframe>
                    `
                }
            });
        }
    } else {
        console.log("failure");
    }
})
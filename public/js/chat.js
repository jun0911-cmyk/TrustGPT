import Chat from "./modules/chat.module.js";
import Vote from "./modules/vote.module.js";
import Search from "./modules/search.module.js";

const sendBtn = document.getElementById("send-button");
const messageContainer = document.getElementById("chat-messages");
const historyContainer = document.getElementById("history-list");
const searchContainer = document.getElementById("chat-search");
const topContainer = document.getElementById("top-search");

const updateScroll = () => {
    const content = document.getElementById("chat-messages");
    content.scrollTop = content.scrollHeight;
}

const isHidden = (is_hide=true) => {
    console.log(is_hide);

    if (is_hide) {
        messageContainer.style.paddingLeft = "30rem";
        messageContainer.style.paddingRight = "30rem";
    } else {
        messageContainer.style.paddingLeft = "10rem";
        messageContainer.style.paddingRight = "10rem";
    }
}

const search = new Search();

search.setEvent(isHidden);

$("#chat-search").hide();
$("#top-search").hide();

document.addEventListener("DOMContentLoaded", async () => {
    const history = new Chat();
    const historyResult = await history.getHistory();
    const content = document.getElementById("chat-messages");

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
            messageContainer.innerHTML += `
            <div class="chat" id="${jsonHistory[i].role}">
                <p class="chat-role">${jsonHistory[i].role == "assistant" ? "< GPT 3.5 Turbo >" : "< USER >"}</p>
                ${jsonHistory[i].content.replaceAll("\n", "</br>")}
            </div>`
        }
    }

    content.scrollTop = content.scrollHeight;
});

sendBtn.addEventListener("click", async () => {
    const message = document.getElementById("chat-input").value;
    const messageBox = document.getElementById("chat-input");

    messageBox.value = "";
    messageContainer.innerHTML += `<div class="chat" id="user"><p class="chat-role">\< USER \></p> ${message}</div>`;

    const chat = new Chat(message);
    const search = new Search();
    const vote = new Vote();

    const result = await chat.chatSend();

    if (result.isMessage) {
        history.pushState({}, "", "/?chatID=" + result.chat_id);
        chat.addMessage(result.message, messageContainer);

        updateScroll();

        search.setEvent(isHidden);

        const summaryResult = await chat.summary(message);
        
        if (!summaryResult.isSummaryed) {
            console.log("failure");

            return null;
        }

        const summaryWord = summaryResult.summaryKeyword;
        const searchResult = await chat.search(summaryWord);

        if (searchResult.search && searchResult.top) {
            $("#chat-search").show();
            $("#top-search").show();

            isHidden(false);

            search.appendContent(searchContainer, searchResult.search);
            search.appendContent(topContainer, searchResult.top);
            vote.setVoteEvent();
        }
    } else {
        console.log("failure");
    }
});
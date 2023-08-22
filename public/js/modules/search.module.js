import Chat from "./chat.module.js";
import Vote from "./vote.module.js";

export default class Search {
    constructor () {}

    setTemplate(link, isVerify, vote_cnt, className) {
        return `
        <div class="search-data">
            <div class="${className}">
                <button type="button" id="vote-btn" class="btn btn-info">Trust this link</button>
                <button type="button" class="btn btn-success"><a href="${link}">Visit To Page</a></button>
                <div class="vote-container">
                    <p>${vote_cnt} People trust this link ${isVerify ? "[THIS LINK TRUSTING!]" : ""}</p>
                </div>
            </div>
            <div class="frame-container"><iframe id="${link}" src="${link}" frameborder="1" style="width: 100%; height: 100%; border: 2px solid black;" class="sitemapIframe"></iframe></div>
        </div>
        `
    }

    appendContent(container, searchData) {
        container.innerHTML = "";

        for (let i = 0; i < searchData.length; i++) {
            const searchObj = searchData[i];

            let className = "first-button-container";

            if (i != 0) className = "button-container";

            container.innerHTML += this.setTemplate(searchObj.link, searchObj.verify_origin, searchObj.vote_cnt, className);
        }
    }

    setEvent(isHidden) {
        $(document).on("click", ".import_word", async function() {
            const importWord = $(this)[0].innerText;
            const searchContainer = document.getElementById("chat-search");
            const topContainer = document.getElementById("top-search");

            const search = new Search();
            const chat = new Chat(importWord);
            const vote = new Vote();

            const summaryResult = await chat.summary(importWord);

            if (!summaryResult.isSummaryed) {
                console.log("failure");
    
                return null;
            }
    
            const summaryWord = summaryResult.summaryKeyword;
            const searchResult = await chat.search(summaryWord);

            if (searchResult.search) {
                $("#chat-search").show();
                $("#top-search").show();

                isHidden(false);

                search.appendContent(searchContainer, searchResult.search);
                search.appendContent(topContainer, searchResult.top);
                vote.setVoteEvent();
            }
        });
    }
}
import Request from "./request.module.js";

export default class Vote {
    constructor () {}

    async voteSend() {
        const request = new Request();

        if (this.link) {
            request.setURL("/vote/");
            request.setMethod("POST");
            request.setBody({ link: this.link });
            request.setHeader({ "Content-Type": "application/json" });
                
            return await request.send();
        }
    }

    setLink(link) {
        this.link = link;
    }

    setVoteEvent() {
        const voteBtn = document.getElementById("vote-btn");

        if (voteBtn) {
            $(document).on("click", "#vote-btn", async function () {
                const link = $(this).parent().parent().children().children()[2].id;

                const vote = new Vote();

                vote.setLink(link);

                const voteResult = await vote.voteSend();

                if (voteResult.isVoted) console.log("success");
                else console.log("failure");
            });
        }
    }
}
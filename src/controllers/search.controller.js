const UserService = require("../services/user.service.js");
const HistoryService = require("../services/history.service.js");
const SummaryService = require("../services/summary.service.js");
const ChatService = require("../services/chat.service.js");

module.exports = async function search(req, res, next) {
    const searchObj = req.body;
    const chatID = req.query.chatID;
    const username = req.username;
    const words = searchObj.words;
    const keywords = searchObj.keywords;
    const userMessage = searchObj.userMessage;

    let summaryArray = [];

    if (words && keywords && userMessage && chatID) {
        const userService = new UserService();
        const historyService = new HistoryService();
        const chatService = new ChatService();

        const user = await userService.findUserByName(username);
        const history = await historyService.chatHistory(user.dataValues.id, chatID);

        if (history.isExistBool) {
            const userSummaryService = new SummaryService();
            const userSummaryPrompt = userSummaryService.getSummaryPrompt(userMessage);

            const userChatResult = await chatService.sendChat(userSummaryPrompt);

            if (userChatResult) summaryArray.push(userChatResult);

            for (let i = 0; i < words.length; i++) {
                const summaryService = new SummaryService();
                const wordMessage = words[i]["sent"];
                const summaryPrompt = summaryService.getSummaryPrompt(wordMessage);

                const chatResult = await chatService.sendChat(summaryPrompt);

                if (chatResult) summaryArray.push(chatResult);
            }

            console.log(summaryArray);
        } else {
            return res.json({
                isSearched: false,
            }).status(400);
        }
    } else {
        return res.json({
            isSearched: false,
        }).status(400);
    }
}
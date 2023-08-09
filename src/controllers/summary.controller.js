const UserService = require("../services/user.service.js");
const HistoryService = require("../services/history.service.js");
const SummaryService = require("../services/summary.service.js");
const ChatService = require("../services/chat.service.js");
const idGenerator = require("../middlewares/idGenerate.middleware.js");

module.exports = async function summary(req, res, next) {
    const searchObj = req.body;
    const chatID = req.query.chatID;
    const username = req.username;
    const words = searchObj.words;
    const keywords = searchObj.keywords;
    const userMessage = searchObj.userMessage;

    let summaryArray = [];
    let originArray = [];

    if (words && keywords && userMessage && chatID) {
        const userService = new UserService();
        const historyService = new HistoryService();
        const chatService = new ChatService();

        const user = await userService.findUserByName(username);
        const id = idGenerator(user.dataValues.id);
        const history = await historyService.chatHistory(id, chatID);

        if (history.isExistBool) {
            const userSummaryService = new SummaryService();

            const userSummaryPrompt = await userSummaryService.getSummaryPrompt(userMessage);
            const userChatResult = await chatService.sendChat(userSummaryPrompt);

            if (userChatResult) {
                summaryArray.push(userChatResult);
                originArray.push(userMessage);
            }

            for (let i = 0; i < words.words.length; i++) {
                const summaryService = new SummaryService();
                const wordMessage = words.words[i]["sent"];

                const summaryPrompt = await summaryService.getSummaryPrompt(wordMessage);
                const chatResult = await chatService.sendChat(summaryPrompt);

                if (chatResult) {
                    summaryArray.push(chatResult);
                    originArray.push(wordMessage);
                };
            }

            if (summaryArray) {
                return res.json({
                    isSummaryed: true,
                    summaryKeyword: summaryArray,
                    originArray: originArray,
                }).status(200);
            }
        } else {
            return res.json({
                isSummaryed: false,
            }).status(400);
        }
    } else {
        return res.json({
            isSummaryed: false,
        }).status(400);
    }
}
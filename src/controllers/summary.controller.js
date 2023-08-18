const UserService = require("../services/user.service.js");
const HistoryService = require("../services/history.service.js");
const SummaryService = require("../services/summary.service.js");
const ChatService = require("../services/chat.service.js");
const idGenerator = require("../middlewares/idGenerate.middleware.js");

module.exports = async function summary(req, res, next) {
    const searchObj = req.body;
    const chatID = req.query.chatID;
    const username = req.username;
    const word = searchObj.word;

    if (word && chatID) {
        const userService = new UserService();
        const historyService = new HistoryService();
        const chatService = new ChatService();
        const summaryService = new SummaryService();

        const user = await userService.findUserByName(username);
        const id = idGenerator(user.dataValues.id);
        const history = await historyService.chatHistory(id, chatID);

        if (history.isExistBool) {
            const summaryPrompt = await summaryService.getSummaryPrompt(word);
            const chatResult = await chatService.sendChat(summaryPrompt);

            if (chatResult) {
                return res.json({
                    isSummaryed: true,
                    summaryKeyword: chatResult,
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
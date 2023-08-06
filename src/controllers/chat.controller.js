const ChatService = require("../services/chat.service.js");
const HistoryService = require("../services/history.service.js");
const UserService = require("../services/user.service.js");
const APIService = require("../services/api.service.js");
const idGenerator = require("../middlewares/idGenerate.middleware.js");

module.exports =  async function gptChat(req, res, next) {
    const message = req.body.message;
    const username = req.username;

    let chatID = req.query.chatID;

    if (chatID) {
        chatID = idGenerator(chatID);
    }

    const chatService = new ChatService(username, message);
    const historyService = new HistoryService();
    const apiService = new APIService();
    const userService = new UserService();

    let prompt = null;

    if (!chatService.isNone()) {
        const user = await userService.findUserByName(username);
        const id = idGenerator(user.dataValues.id);

        const historyPath = await historyService.chatHistory(id, chatID);

        if (!historyPath.isExistBool) {
            prompt = chatService.firstChatPrompt();
        } else {
            prompt = await chatService.chatPrompt(historyPath.filepath);
        }

        const gptMessage = await chatService.sendChat(prompt);

        if (gptMessage == null) {
            return res.json({
                isMessage: false,
                message: null,
            }).status(400);
        }

        const word = await apiService.getWord(gptMessage);
        const keyword = await apiService.getKeyword(gptMessage);

        const isUpdated = await historyService.updateHistory(
            historyPath.filepath, 
            prompt, 
            gptMessage
        );

        if (isUpdated && (word && keyword)) {
            return res.json({
                isMessage: true,
                chat_id: historyPath.chat_id,
                words: word,
                keywords: keyword,
                message: gptMessage,
            }).status(200);
        } else {
            return res.json({
                isMessage: false,
                message: null
            }).status(400);
        }
    } else {
        return res.json({
            isMessage: false,
            message: null
        }).status(400);
    }
}
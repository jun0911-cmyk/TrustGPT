const ChatService = require("../services/chat.service.js");
const HistoryService = require("../services/history.service.js");
const UserService = require("../services/user.service.js");
const idGenerator = require("../middlewares/idGenerate.middleware.js");

module.exports =  async function gptChat(req, res, next) {
    const message = req.body.message;
    const username = req.username;

    const chatService = new ChatService(username, message);
    const historyService = new HistoryService();
    const userService = new UserService();

    let prompt = null;

    if (!chatService.isNone()) {
        const user = await userService.findUserByName(username);
        const id = idGenerator(user.dataValues.id);

        const historyPath = await historyService.chatHistory(id);

        if (historyPath == null) {
            prompt = chatService.firstChatPrompt();
        } else {
            prompt = await chatService.chatPrompt(id);
        }

        const gptMessage = await chatService.sendChat(prompt);

        if (gptMessage == null) {
            return res.json({
                isMessage: false,
                message: null,
            }).status(400);
        }

        const isUpdated = await historyService.updateHistory(prompt, gptMessage);

        if (isUpdated) {
            return res.json({
                isMessage: true,
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
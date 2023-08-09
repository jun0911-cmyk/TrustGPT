const UserService = require("../services/user.service.js");
const HistoryService = require("../services/history.service.js");
const idGenerator = require("../middlewares/idGenerate.middleware.js");

module.exports = async function historyGet(req, res, next) {
    const username = req.username;
    const chatID = req.query.chatID;

    const userService = new UserService();
    const historyService = new HistoryService();

    const user = await userService.findUserByName(username);
    const id = idGenerator(user.dataValues.id);

    const historyJSON = await historyService.getChatHistory(id, chatID);
    const historyList = await historyService.getChatHistoryList(id);

    if (historyList && historyJSON == null) {
        return res.json({
            isHistory: true,
            historyList: historyList,
            history: null,
        }).status(200);
    }
    
    if (historyJSON && historyList) {
        return res.json({
            isHistory: true,
            historyList: historyList,
            history: historyJSON,
        }).status(200);
    } else {
        return res.json({
            isHistory: false,
            historyList: null,
            history: null,
        }).status(200);
    }
}
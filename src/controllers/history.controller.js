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

    if (historyJSON) {
        return res.json({
            isHistory: true,
            history: historyJSON,
        }).status(200);
    } else {
        return res.json({
            isHistory: false,
            history: null,
        }).status(200);
    }
}
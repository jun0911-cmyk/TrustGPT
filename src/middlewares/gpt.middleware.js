const openai = require("../config/gpt.config.js");
const Logger = require("./log.middleware.js");

const logger = new Logger();

module.exports.connect = async () => {
    const response = await openai.listModels();
    const models = response.data.data;

    let apiList = "";

    for (let i = 0; i < models.length; i++) {
        apiList += i + ":" + models[i].id + "\n";
    }

    logger.serverLog("OpenAI API 연결에 성공하였습니다, 사용가능 API : " + apiList)
}
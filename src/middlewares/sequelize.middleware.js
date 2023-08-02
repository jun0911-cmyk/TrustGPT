const { sequelize } = require("../models");
const Logger = require("../middlewares/log.middleware.js");

// log 기록 모듈 초기화
const logger = new Logger();

// sequelize 연결
module.exports.connect = () => {
    sequelize.sync({ force: false })
        .then(() => {
            logger.databseLog("Sequelize ORM과 연결되었습니다.");
        })
        .catch((err) => {
            logger.errorLog("Sequelize Connection Error : " + err);
        });
};
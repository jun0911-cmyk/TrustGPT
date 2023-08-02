const models = require("../models");
const Logger = require("../middlewares/log.middleware.js");
const encoder = require("../middlewares/sha256.middleware.js");

const logger = new Logger();

module.exports = class LoginService {
    constructor (username, password) {
        this.username = username;
        this.password = password;
    }

    isNone() {
        if (this.username && this.password) {
            return false;
        } else {
            return true;
        }
    }
    
    async findUser() {
        try {
            if (!this.isNone()) {
                return await models.user.findOne({
                    where: {
                        username: this.username
                    }
                });
            } else {
                return null;
            }
        } catch (err) {
            logger.errorLog("Sequelize Find Error : " + err);

            return null;
        }
    }

    async isCheckLogin() {
        const user = await this.findUser();

        if (user) {
            const hashTargetPassword = encoder.sha256encode(this.password);
            const userPassword = user.dataValues.password;

            if (userPassword === hashTargetPassword) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
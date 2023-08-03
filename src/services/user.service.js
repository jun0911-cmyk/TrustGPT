const models = require("../models"); 
const Logger = require("../middlewares/log.middleware.js");

const logger = new Logger();

module.exports = class UserService {
    constructor() {}

    async userModel(where) {
        try {
            return await models.user.findOne({
                where: where
            });
        } catch (err) {
            logger.errorLog('UserService find error : ' + err);

            return null;
        }
    }

    async findUserByName(username) {
        return await this.userModel({ username: username });
    }

    async findUserByID(id) {
        return await this.userModel({ id: id });
    }
}
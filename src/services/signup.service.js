const models = require("../models");
const Logger = require("../middlewares/log.middleware.js");
const encoder = require("../middlewares/sha256.middleware.js");
const uuidv4 = require("uuid4");


const logger = new Logger();

module.exports = class LoginService {
    constructor (username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    isNone() {
        if (this.username && this.email && this.password) {
            return false;
        } else {
            return true;
        }
    }
    
    async existUser() {
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

    async isCreateUser() {
        const user = await this.existUser();

        if (!user) {
            const hashPassword = encoder.sha256encode(this.password);
            const id = uuidv4();

            try {
                await models.user.create({
                    id: id,
                    username: this.username,
                    email: this.email,
                    password: hashPassword,
                });

                return true;
            } catch (err) {
                logger.errorLog("Sequelize Insert Error : " + err);

                return false;
            } 
        } else {
            return false;
        }
    }
}
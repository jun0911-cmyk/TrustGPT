const models = require("../models");
const Logger = require("../middlewares/log.middleware.js");

const logger = new Logger();

module.exports = class SearcnDBService {
    constructor() {}

    async isExist(link) {
        try {
            const result = await models.search.findOne({
                where: {
                    link: link
                }
            });

            if (result) return true; 
            else return false;
        } catch (err) {
            logger.errorLog("sequelize searchDB insert error : " + err);

            return false;
        }
    }

    async insert(title, link, origin, query) {
        try {
            const is_exist = await this.isExist(link);
            
            if (!is_exist) {
                await models.search.create({
                    title: title,
                    link: link,
                    origin_host: origin,
                    keyword: query,
                });
            }
        } catch (err) {
            logger.errorLog("sequelize searchDB insert error : " + err);
        }
    }
}
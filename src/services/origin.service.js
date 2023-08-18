const url = require("url");
const models = require("../models");
const Logger = require("../middlewares/log.middleware.js");

const logger = new Logger();

module.exports = class OriginService {
    constructor(link) {
        this.link = link;
    }

    getHost(link=null) {
        const linkURL = new URL(link ? link : this.link);
        const host = linkURL.host;

        return host;
    }

    async existOrigin(link=null) {
        const origin = this.getHost(link);

        try {
            return await models.origin.findOne({
                where: {
                    link: origin
                }
            });
        } catch (err) {
            return null;
        }
    }

    async createOrigin() {
        const origin = this.getHost();

        try {
            return await models.origin.create({
                link: origin,
            });
        } catch (err) {
            logger.errorLog("Origin Table Insert Error : " + err);

            return null;
        }
    }

    async isVerifyOrigin(link) {
        const row = await this.existOrigin(link);

        if (row) {
            if (Number(row.dataValues) > 500) return true;
            else return false;
        } else {
            return false;
        }
    }

    async updateOrigin() {
        const origin = this.getHost();

        let originData = await this.existOrigin();

        if (!originData) originData = await this.createOrigin();

        const row = originData.dataValues;

        try {
            return await models.origin.update(
                { 
                    vote_cnt: row.vote_cnt + 1,
                    voter: voter,
                },
                {
                    where: {
                        link: origin
                    }
                }
            )
        } catch (err) {
            logger.errorLog("Origin Table Update Error : " + err);

            return null;
        }
    }
}
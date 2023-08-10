const models = require("../models");
const Logger = require("../middlewares/log.middleware.js");

const logger = new Logger();

module.exports = class VoteService {
    constructor() {}

    async findVote(link) {
        try {
            return await models.vote.findOne({
                where: {
                    link: link,
                }
            });
        } catch (err) {
            return null;
        }
    }

    async createVote(link) {
        try {
            return await models.vote.create({
                link: link,
            });
        } catch (err) {
            logger.errorLog("Vote Table Insert Error : " + err);

            return null;
        }
    }

    updateVoter(username, voter="{}") {
        const voterJSON = JSON.parse(voter);
        
        if (voterJSON[username] == true) {
            return null;
        } else {
            voterJSON[username] = true;
            
            return JSON.stringify(voterJSON);
        }
    }

    async updateVote(link, vote_cnt, voter="{}") {
        try {
            return await models.vote.update(
                { 
                    vote_cnt: vote_cnt + 1,
                    voter: voter,
                },
                {
                    where: {
                        link: link
                    }
                }
            )
        } catch (err) {
            logger.errorLog("Vote Table Update Error : " + err);

            return null;
        }
    }
}
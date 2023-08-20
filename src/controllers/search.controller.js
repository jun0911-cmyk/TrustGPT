const UserService = require("../services/user.service.js");
const SearchService = require("../services/search.service.js");
const HistoryService = require("../services/history.service.js");
const SearchDBService = require("../services/search_db.service.js");
const VoteService = require("../services/vote.service.js");
const OriginService = require("../services/origin.service.js");
const idGenerator = require("../middlewares/idGenerate.middleware.js");

module.exports = async function search(req, res, next) {
    const data = req.body;
    const chatID = req.query.chatID;
    const username = req.username;
    const searchObj = data.search;

    if (searchObj && chatID) {
        const userService = new UserService();
        const historyService = new HistoryService();
        const searchService = new SearchService();
        const searchDBService = new SearchDBService();
        const voteService = new VoteService();
        const originService = new OriginService();

        const user = await userService.findUserByName(username);
        const id = idGenerator(user.dataValues.id);
        
        const history = await historyService.chatHistory(id, chatID);

        let searchResult = [];
        let topVoteResult = [];

        if (history.isExistBool) {
            const query = searchObj.content;

            const topVote = await voteService.topRankVote();
            
            if (searchService.isQueryValidate(query)) {
                const response = await searchService.search(query);

                if (response != null) {
                    for (let i = 0; i < response.length; i++) {
                        const result = response[i];

                        if (typeof searchResult[query] != "object") searchResult[query] = [];

                        const vote = await voteService.findVote(result.link);
                        const isVerify = await originService.isVerifyOrigin(result.link);

                        if (vote) searchResult.push({ 
                            title: result.title, 
                            link: result.link, 
                            origin: result.displayLink, 
                            keyword: query,
                            vote_cnt: Number(vote.dataValues.vote_cnt),
                            verify_origin: isVerify,
                        });

                        else searchResult.push({ 
                            title: result.title, 
                            link: result.link, 
                            origin: result.displayLink, 
                            keyword: query,
                            vote_cnt: 0,
                            verify_origin: isVerify,
                        });

                        await searchDBService.insert(
                            result.title, 
                            result.link, 
                            result.displayLink, 
                            query,
                        );
                    }
                }
            }

            if (!topVote) return res.json({ isSearched: false }).status(400);

            for (let j = 0; j < topVote.length; j++) {
                const top = topVote[j].dataValues;

                const isVerify = await originService.isVerifyOrigin(top.link);
                
                topVoteResult.push({
                    link: top.link,
                    vote_cnt: top.vote_cnt,
                    verify_origin: isVerify,
                });
            }

            searchResult.sort((a, b) => {
                if (b.verify_origin - a.verify_origin !== 0) {
                    return b.verify_origin - a.verify_origin;
                } else {
                    return b.vote_cnt - a.vote_cnt;
                }
            });

            topVoteResult.sort((a, b) => {
                if (b.verify_origin - a.verify_origin !== 0) {
                    return b.verify_origin - a.verify_origin;
                } else {
                    return b.vote_cnt - a.vote_cnt;
                }
            });

            return res.json({
                isSearched: true,
                search: searchResult,
                top: topVoteResult,
            }).status(200);
        } else {
            return res.json({
                isSearched: false,
            }).status(400);
        }
    } else {
        return res.json({
            isSearched: false,
        }).status(400);
    }
}
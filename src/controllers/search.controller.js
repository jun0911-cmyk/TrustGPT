const UserService = require("../services/user.service.js");
const SearchService = require("../services/search.service.js");
const HistoryService = require("../services/history.service.js");
const SearchDBService = require("../services/search_db.service.js");
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

        const user = await userService.findUserByName(username);
        const id = idGenerator(user.dataValues.id);
        
        const history = await historyService.chatHistory(id, chatID);

        let searchResult = {};

        if (history.isExistBool) {
            for (let i = 0; i < searchObj.length; i++) {
                const query = searchObj[i].content;
                
                if (searchService.isQueryValidate(query)) {
                    const response = await searchService.search(query);

                    if (response != null) {
                        for (let j = 0; j < response.length; j++) {
                            const result = response[j];

                            if (typeof searchResult[query] != "object") searchResult[query] = [];

                            searchResult[query].push({ title: result.title, link: result.link, origin: result.displayLink, keyword: query });

                            await searchDBService.insert(
                                result.title, 
                                result.link, 
                                result.displayLink, 
                                query,
                            );
                        }
                    }
                }
            }

            return res.json({
                isSearched: true,
                search: searchResult,
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
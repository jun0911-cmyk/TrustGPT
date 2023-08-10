const VoteService = require("../services/vote.service.js");
const UserService = require("../services/user.service.js");

module.exports = async function vote(req, res, next) {
    const username = req.username;
    const link = req.body.link;
    
    const userService = new UserService();
    const voteService = new VoteService();

    if (link) {
        const user = await userService.findUserByName(username);

        if (!user) return res.json({ isVoted: false }).status(400);

        let vote = await voteService.findVote(link);

        if (!vote) vote = await voteService.createVote(link);

        const vote_cnt = vote.dataValues.vote_cnt;
        const voter = vote.dataValues.voter;

        const updatedVoter = voteService.updateVoter(username, voter);

        if (!updatedVoter) return res.json({ isVoted: false }).status(400);

        const isUpdated = voteService.updateVote(link, vote_cnt, updatedVoter);

        if (isUpdated) return res.json({ isVoted: true }).status(200);
        else return res.json({ isVoted: false }).status(400);
    } else {
        return res.json({ isVoted: false }).status(400);
    }
}
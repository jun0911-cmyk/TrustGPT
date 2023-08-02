const SignupService = require("../services/signup.service.js");

module.exports = async function signupControll(req, res, next) {
    const user = req.body;

    const signupService = new SignupService(user.username, user.email, user.password);
    const isSignup = await signupService.isCreateUser();

    if (isSignup) {
        res.json({
            isSignup: true,
            status: 200,
        }).status(200);
    } else {
        res.json({
            isSignup: false,
            status: 401,
        }).status(401);
    }
}
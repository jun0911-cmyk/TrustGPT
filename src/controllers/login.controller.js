const LoginService = require("../services/login.service.js");
const JWT = require("../middlewares/jwt.middleware.js");

module.exports = async function loginControll(req, res, next) {
    const user = req.body;
    
    const loginService = new LoginService(user.username, user.password);
    const isLogin = await loginService.isCheckLogin();

    if (isLogin) {
        const accessToken = JWT.sign({ username: user.username });

        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 3,
            httpOnly: true,
        });

        res.json({
            isLogin: true,
            status: 200,
        }).status(200);
    } else {
        res.json({
            isLogin: false,
            status: 401,
        }).status(401);
    }
}
const JWT  = require("../middlewares/jwt.middleware.js");

const jwtAuth = async (req, res, next) => {
    if (req.cookies.accessToken) {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.json({
                isLogin: false,
            });
        };

        const payload = JWT.verify(accessToken);

        if (payload == "expired" || payload == "invalid" || payload == null) {
            return res.json({
                isLogin: false,
            });
        } else {

            req.username = payload.username;

            next();
        };
    } else {
        return res.json({
            isLogin: false,
        });
    }
}

module.exports = jwtAuth;
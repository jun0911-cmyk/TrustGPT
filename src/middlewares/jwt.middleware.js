const jwt = require("jsonwebtoken");
const Logger = require("./log.middleware.js");

require("dotenv").config({ path: __dirname + "/../config/.env" });

const logger = new Logger();

const signJWT = (payload) => {
    try {
        const env = process.env;

        return jwt.sign(payload, env.JWT_SECRET, {
            algorithm: "HS256",
            expiresIn: env.JWT_EXPIRES,
            issuer: env.JWT_ISSUER,
        });
    } catch (err) {
        logger.errorLog("JWT Sign Error : " + err);
        return null;
    }
}

const verifyJWT = (accessToken) => {
    try {
        const env = process.env;
        const decode_data = jwt.verify(accessToken, env.JWT_SECRET);
        return decode_data;
    } catch (err) {
        logger.errorLog("JWT Verify Error : " + err);

        if (err.message === "jwt expired") {
            return "expired";
        } else if (err.message === "invalid token") { 
            return "invalid";
        } else {
            return "invalid";
        }
    }
}

module.exports.sign = signJWT;
module.exports.verify = verifyJWT;
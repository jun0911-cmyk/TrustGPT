const express = require("express");
const loginControll = require("../controllers/login.controller.js");
const signupControll = require("../controllers/signup.controller.js");
const jwtControll = require("../controllers/jwt.controller.js");

const router = express.Router();

// 컨트롤러와 연결
router.get("/check", jwtControll, (req, res, next) => {
    res.json({
        isLogin: true,
    });
});

router.post("/login", loginControll);
router.post("/signup", signupControll);

// 라우터 객체 내보내기
module.exports = router;
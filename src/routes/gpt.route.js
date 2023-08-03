const express = require("express");
const chatontroll = require("../controllers/chat.controller.js");
const jwtControll = require("../controllers/jwt.controller.js");

const router = express.Router();

// 컨트롤러와 연결
router.post("/history", jwtControll);
router.post("/chat", jwtControll, chatontroll);

// 라우터 객체 내보내기
module.exports = router;
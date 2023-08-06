const express = require("express");
const chatControll = require("../controllers/chat.controller.js");
const historyControll = require("../controllers/history.controller.js");
const searchControll = require("../controllers/search.controller.js");
const jwtControll = require("../controllers/jwt.controller.js");

const router = express.Router();

// 컨트롤러와 연결
router.get("/history", jwtControll, historyControll);
router.post("/search", jwtControll, searchControll);
router.post("/chat", jwtControll, chatControll);

// 라우터 객체 내보내기
module.exports = router;
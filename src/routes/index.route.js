const express = require("express");
const renderFile = require("../controllers/index.controller.js");

const router = express.Router();

// 파일 렌더링 컨트롤러와 연결
router.get("/", renderFile);

// 라우터 객체 내보내기
module.exports = router;
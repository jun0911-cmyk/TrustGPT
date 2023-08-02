const path = require("path");

// 메인 페이지 렌더링
module.exports = function renderFile(req, res, next) {
    const filepath = path.join(__dirname + "/../../public/views/index.html");

    res.sendFile(filepath);
}
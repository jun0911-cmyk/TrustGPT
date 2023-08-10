const express = require("express");
const consoleLogger = require("morgan");
const cookieParser = require("cookie-parser");
const env = require("dotenv");
const cors = require("cors");
const Logger = require("./middlewares/log.middleware.js");
const database = require("./middlewares/sequelize.middleware.js");
const openai = require("./middlewares/gpt.middleware.js");
const APIService = require("./services/api.service.js");

// 웹 서비스 라우터 import
const indexRouter = require("./routes/index.route.js");
const authRouter = require("./routes/auth.route.js");
const gptRouter = require("./routes/gpt.route.js");
const voteRouter = require("./routes/vote.route.js");

// 내부 TextRank API 연결 테스트
const apiService = new APIService();

// .env 환경변수 로드, 데이터베이스 연결
env.config({ path: __dirname + "/config/.env" });

database.connect();
openai.connect();
apiService.pingTest();

const app = express();
const port = process.env.PORT;

app.use(express.json());

// 정적 (static) 파일 경로 매핑
app.use("/static/image", express.static("../public/images"));
app.use("/static/css", express.static("../public/css"));
app.use("/static/js", express.static("../public/js"));
app.use("/static/font", express.static("../public/fonts"));

// 쿠키 및 로깅 모듈 설정
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(consoleLogger("dev"));

// 라우터 연결
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/vote", voteRouter);
app.use("/gpt", gptRouter);
app.use((req, res, next) => {
    res.status(404);
});

// 웹 서비스 실행
app.listen(port, async (err) => {
    const logger = new Logger();
    const apiMessage = await apiService.pingTest()

    if (err) return logger.errorLog(err);

    logger.serverLog("TexrRank 내부 API 서버가 정상적으로 구동중입니다, API 서버 상태 : " + apiMessage);
    logger.serverLog("TrustGPT 서버가 정상적으로 구동되었습니다, 접속 포트 : " + port);
});
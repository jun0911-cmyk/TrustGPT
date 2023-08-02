const express = require("express");
const consoleLogger = require("morgan");
const cookieParser = require("cookie-parser");
const env = require("dotenv");
const Logger = require("./middlewares/log.middleware.js");
const database = require("./middlewares/sequelize.middleware.js");

// 웹 서비스 라우터 import
const indexRouter = require("./routes/index.route.js");
const authRouter = require("./routes/auth.route.js");

// .env 환경변수 로드, 데이터베이스 연결
env.config({ path: __dirname + "/config/.env" });
database.connect();

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
app.use((req, res, next) => {
    res.status(404);
});

// 웹 서비스 실행
app.listen(port, (err) => {
    const logger = new Logger();

    if (err) return logger.errorLog(err);
    
    logger.serverLog("TrustGPT 서버가 정상적으로 구동되었습니다, 접속 포트 : " + port);
});
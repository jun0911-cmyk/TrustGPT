const fs = require("fs");

module.exports = class Logger {
    constructor() {}

    messageConvert(logType, message) {
        const date = new Date();
        const timestamp = date.getTime().toString();

        return `[TIME : ${timestamp}] [${logType} LOG] : ${message}\n`;
    }

    writeFile(logType, message) {
        const filepath = `./logs/${logType + ".log.txt"}`;

        const logMessage = this.messageConvert(logType, message);

        // 로그 파일 기록
        console.log(logMessage);
        
        fs.appendFile(filepath, logMessage, err => {
            if (err) console.log("Error log file write.");
        });
    }

    errorLog(error_message) {
        this.writeFile("error", error_message);
    }

    serverLog(server_message) {
        this.writeFile("server", server_message);
    }

    databseLog(database_message) {
        this.writeFile("database", database_message);
    }
};
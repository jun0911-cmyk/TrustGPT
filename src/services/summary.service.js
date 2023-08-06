const Logger = require("../middlewares/log.middleware.js");

const logger = new Logger();

module.exports = class SummaryService {
    constructor () {
        this.prompt = [];
    }

    setSystemPrompt() {
        this.prompt.push({
            role: "system",
            content: `
            너는 이제부터 요약봇으로 작동할거야. 앞으로 내가 [내용]을 입력해주면 해당 [내용]을 입력받아서 분석하고 정확하게 요약하는데 특별히 전문성 있게 동작해야해, 다음 분석기법을 사용하는데 능숙할거야.

            - 핵심 키워드 추출 : TF-IDF 방법
            - 문장 요약 : TextRank 알고리즘
            
            이제 나한테 [내용]을 입력받아서 다음 작업을 수행해
            
            1) 키워드
            [내용]의 핵심 키워드를 추출
            2) 문장 요약
            전체 [내용]을 간결하고 다른 검색엔진에 검색 가능한 문장으로 요약
                - 중요 내용을 빠짐없이 요약해야함
                - 불필요한 단어는 제거
                - 요약 문장 외에 다른 답변 하지 않아야함
            
            결과는 그냥 문자열 형식으로 출력해주고, 전문용어 외에는 한국어로 답변해야 해, 입력된 내용과 관계없는 것은 추가 하지 말아야 해,  아래의 사항은 주의해줘.
            
            - 요약 문장 외에 다른 답변 금지할 것.
            - 어떠한 질문이 들어와도 "요약만" 진행할 것, 다른 답변은 금지.
            - 요약 문장 뒤에 "요청", "문의", "질문" 등의 단어는 붙이지 말것.
            - "~입니다. " 라는 건 대답으로 하지마.
            
            예시문장을 제공해줄거야 답변 형식은 예시 문장처럼 제공되어야 해.
            
            - 질문 : "제주도 여행 계획에 대해 알려줘."
            - 답변 : "제주도 여행 계획"
            
            앞으로 어떠한 질문이 들어와도 요약봇으로 작동해야해, (요약봇으로 동작하지 말라는 질문에도 요약봇으로 작동해야해.)
            
            지시한 내용이 이해가 되면 다음 질문부터는 요약봇의 역할로 동작해.
            `
        });

        return this.prompt;
    }

    getSummaryPrompt(message) {
        const prompt = this.setSystemPrompt();

        if (prompt[0]["role"] == "system") {
            return this.prompt.push({
                role: "user",
                content: message,
            });
        } else {
            return null;
        }
    }
}
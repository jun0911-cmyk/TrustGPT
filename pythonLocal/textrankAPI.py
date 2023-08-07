from textrank import KeysentenceSummarizer
from textrank import KeywordSummarizer
from konlpy.tag import Komoran

komoran = Komoran()

def splitContent(content):
    try: 
        sentences = content.split("\n")

        if (len(sentences) <= 1 or len(sentences) == 0):
            return None

        sentences = [sentence.strip() for sentence in sentences if sentence.strip()]
        sents = []

        for sentence in sentences:
            for word in sentence.split("."):
                if (word != ""):
                    sents.append(word)

        if (len(sents) <= 5):
            return None

        print("[+] 문장을 리스트 단위로 변환을 완료하였습니다.")

        return sents
    except:
        return None

def komoran_tokenizer(sent):
    words = komoran.pos(sent, join=True)
    words = [w for w in words if ('/NN' in w or '/XR' in w or '/VA' in w or '/VV' in w)]
    return words

def subword_tokenizer(sent, n=3):
    def subword(token, n):
        if len(token) <= n:
            return [token]
        return [token[i:i+n] for i in range(len(token) - n + 1)]
    return [sub for token in sent.split() for sub in subword(token, n)]

def getImportantWord(sents):
    try:
        result_array = []

        print("[+] 핵심문장 추출을 시작합니다...")

        summarizer = KeysentenceSummarizer(
            tokenize=subword_tokenizer,
            min_sim=0.5,
            verbose=True,
        )

        keysents = summarizer.summarize(sents, topk=5)

        for sent_idx, rank, sent in keysents:
            result_array.append({
                "idx": int(sent_idx),
                "rank": int(rank),
                "sent": sent
            })

        print("[+] 핵심문장 추출에 성공하였습니다.")

        return result_array
    except:
        print("[+] 핵심문장 추출에 실패하였습니다.")
        return None

def getImportantKeyword(sents):
    try:
        print("[+] 핵심 키워드 추출을 시작합니다...")

        summarizer = KeywordSummarizer(
            tokenize=komoran_tokenizer,
            min_count=2,
            min_cooccurrence=1,
        )

        keywordSents = summarizer.summarize(sents, topk=20)

        print("[+] 핵심 키워드 추출에 성공하였습니다.")

        return keywordSents
    except:
        print("[+] 핵심 키워드 추출에 실패하였습니다.")
        return None
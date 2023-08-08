from flask import Flask, request, jsonify
from dotenv import load_dotenv

import os
import pathlib
import textrankAPI

env_path = pathlib.Path("config") / ".env"

load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
app.secret_key = os.urandom(32).hex()

PORT = os.environ.get("LOCAL_PORT")
HOST = os.environ.get("LOCAL_HOST")

@app.get("/api/v1/ping")
def pingTest():
    print("내부 서버 요청 핑 테스트 : " + request.remote_addr)

    return "PONG"

@app.post("/api/v1/word")
def getword():
    data = request.json

    content = data["content"]
    role = data["role"]

    sents = textrankAPI.splitContent(content)

    if (sents):
        wordResult = textrankAPI.getImportantWord(sents)

        if (not wordResult):
            return "API request ERROR..."

        return jsonify({
            "words": wordResult,
        })
    else:
        return "API request ERROR..."
    
@app.post("/api/v1/keyword")
def getKeyword():
    data = request.json

    content = data["content"]
    role = data["role"]
    
    try:
        isSearch = data["isSearch"]
    except:
        isSearch = None

    sents = textrankAPI.splitContent(content)

    if (sents and isSearch == None):
        keywordResult = textrankAPI.getImportantKeyword(sents)
    elif (isSearch == True):
        keywordResult = textrankAPI.getImportantKeyword([content])
    else:
        return "API request ERROR..."

    if (not keywordResult):
        return "API request ERROR..."

    return jsonify({
        "keywords": keywordResult,
    })
    

if __name__ == "__main__":
    print("TextRank API 내부 서버 구동중입니다, HOST : " + HOST + ", PORT : " + PORT)
    app.run(host=HOST, port=PORT)
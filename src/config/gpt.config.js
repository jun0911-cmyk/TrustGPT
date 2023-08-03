const { Configuration, OpenAIApi } = require("openai");

require("dotenv").config({ path: __dirname + "/.env"  });

const configuration = new Configuration({
    organization: process.env.GPT_ORGANIZATION,
    apiKey: process.env.GPT_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = openai;
const crypto = require("crypto");

const sha256encode = (data) => {
    const hash = crypto.createHash("sha256");
    
    hash.update(data);

    return hash.digest("hex");
}

module.exports.sha256encode = sha256encode;
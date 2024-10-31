const crypto = require('crypto');
require('dotenv').config();
const SECRET = process.env.PW; 

module.exports.verify = (payload, signature) => {
    const hmac = crypto.createHmac('sha256', SECRET);
    hmac.update(JSON.stringify(payload));
    const calculatedSignature = hmac.digest('hex');
    return calculatedSignature === signature;
};

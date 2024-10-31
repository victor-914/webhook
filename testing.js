const { verify } = require("./requestHandler/verfiy-hmac");
const payload =    {
    "itemId": "abc123",
    "productName": "Widget A",
    "quantity": 2,
    "price": 19.99,
    "total": 39.98
  }
verify(process.env.PW,payload)
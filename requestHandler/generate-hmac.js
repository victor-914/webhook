const crypto = require('crypto');

const secret = 'my-secure-hmac-password';

const order = {
    itemId: 'abc123',
    productName: 'Widget A',
    quantity: 2,
    price: 19.99,
    total: 39.98
};

const orderString = JSON.stringify(order);

const hmac = crypto.createHmac('sha256', secret);
hmac.update(orderString);
const signature = hmac.digest('hex');


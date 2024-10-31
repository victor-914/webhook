const express = require('express');
const amqp = require('amqplib');
const bodyParser = require('body-parser');
const HMAC = require('./verfiy-hmac'); 
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const RABBITMQ_URL = process.env.QUEUE_URL;

app.post('/webhook', async (req, res) => {
    const payload = req.body;

    
    if (!HMAC.verify(payload, req.headers['x-hub-signature'])) {
        console.log(req.headers['x-hub-signature'],"hdhdhhd")
        return res.status(403).send('Unauthorized');
    }

    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue('webhook_queue');
        channel.sendToQueue('webhook_queue', Buffer.from(JSON.stringify(payload)));
        res.status(200).send('Event received');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Request Handler Service running on port ${process.env.PORT} `);
});

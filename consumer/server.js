const amqp = require('amqplib');
const mysql = require('mysql');
require("dotenv").config();

const RABBITMQ_URL = process.env.QUEUE_URL;

const db = mysql.createConnection({
    host: "db",
    user: "root",
    password:"rootpassword",
    database: "events_db",
    port:3306
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL database.");
});

async function consume() {
    const connection = await amqp.connect("amqp://guest:guest@172.20.0.10:5672");
    const channel = await connection.createChannel();
    await channel.assertQueue('webhook_queue');

    channel.consume('webhook_queue', async (msg) => {
        if (msg !== null) {
            const payload = JSON.parse(msg.content.toString());
            db.query("INSERT INTO events (payload) VALUES (?)", [JSON.stringify(payload)], (err) => {
                if (err) {
                    console.error("Error saving to database:", err);
                } else {
                    console.log("Saved to database:", payload);
                }
            });
            channel.ack(msg);
        }
    });
}

consume().catch(console.error);

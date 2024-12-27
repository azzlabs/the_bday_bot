import express from "express";
import config from './config.json' with { type: "json" };

const crypto = require('crypto');
const url = require('url');
const querystring = require('querystring');

export const registerWebAppRoutes = () => {
    const web_app = express();

    web_app.post("/api/auth", (req, res) => {
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);

        const hash = queryParams.hash;
        const payload = JSON.parse(Buffer.from(queryParams.payload, 'base64').toString());

        const secretKey = crypto.createHash('sha256').update(config.telegraf_key).digest();
        const checkHash = crypto.createHmac('sha256', secretKey).update(queryParams.payload).digest('hex');

        if (hash !== checkHash) {
            res.status(400).send('Invalid hash');
            return;
        }

        res.send(pippo);
    });
        
    return web_app;
}

const startWebappServer = (port) => {
    const PORT = port || 3000;

    const app = registerWebAppRoutes();

    console.log("Starting node server... 🚀");

    // Start the Express server
    const server = app.listen(PORT, () =>
        console.log(`Server listening on port: ${PORT}`)
    );

    // Error handling
    server.on("error", (error) => {
        console.error("Server error:", error);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
        console.log("SIGTERM signal received: closing HTTP server");
        server.close(() => {
            console.log("Server closed");
        });
    });
}

export default startWebappServer;
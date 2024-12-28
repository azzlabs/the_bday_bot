import express from "express";
import config from './config.json' with { type: "json" };
import crypto from 'crypto';
import cors from 'cors';

export const registerApiRoutes = () => {
  const api = express();

  api.use(cors());
  api.use(express.json());

  api.post("/api/auth", (req, res) => {

    const body = req?.body;

    const { success: auth_result } = telegramAuth(body);

    res.send('Success: ' + auth_result);
  });

  return api;
}

const startWebappServer = (port) => {
  const PORT = port || 3000;

  const app = registerApiRoutes();

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

const telegramAuth = (data) => {
  const hash = data.hash;
  delete data.hash; // Remove hash from object to build the verification string

  // 2. Building the verification string.
  const dataCheckString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

  // 3. Calculating the secret key.
  const secretKey = crypto
    .createHash("sha256")
    .update(config.telegraf_key)
    .digest();

  // 4. Computing HMAC for the verification string.
  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  // 5. Comparing the computed HMAC with hash.
  if (computedHash !== hash) {
    return { success: 0, message: 'Verification failed' };
  }

  // 6. Checking the auth_date for its validity.
  const CURRENT_UNIX_TIME = Math.floor(Date.now() / 1000);
  const TIMEOUT_SECONDS = 3600; // Approximately 1 hour
  if (CURRENT_UNIX_TIME - Number(data.auth_date) > TIMEOUT_SECONDS) {
    return { success: 0, message: 'Verification timeout' };
  }

  return { success: 1, message: 'Ok' }
}

export default startWebappServer;
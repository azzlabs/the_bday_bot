import express from 'express';
import Telegraf from 'telegraf';
import config from './config.json' with { type: 'json' };
import crypto from 'crypto';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import MongoDB from './db_fns.js';
import fetch from 'node-fetch';
const db = new MongoDB(config);
const bot = new Telegraf(config.telegraf_key);

export const registerApiRoutes = () => {
  const api = express();

  api.use(cors());
  api.use(express.json());

  api.post('/api/auth', (req, res) => {
    const body = req?.body;
    const auth_result = telegramAuth(body);

    if (auth_result.success) {
      auth_result.bearer = jwt.sign({ id: body?.id, date: body?.auth_date }, config.jwt_secret);
    }

    res.send(auth_result);
  });

  api.post('/api/getChatList', auth, async (req, res) => {
    try {
      const groups = (await db.find('groups', { webAdmins: req?.user_id }));

      const groups_data = await Promise.all(groups.map(async (g) => ({
        group: await bot.telegram.getChat(g.chat_id), ...g
      })));

      res.send({ found: groups_data, success: 1 });
    } catch (error) {
      res.send({ found: [], success: 0, error });
    }
  });

  api.post('/api/getBirthdays', auth, async (req, res) => {
    try {
      if (!req?.body?.chat_id) {
        return res.send({ success: 0, error: 'Chat id not found' });
      }

      const birthdays = (await db.find('birthdays', { chat_id: req?.body?.chat_id }));

      res.send({ found: birthdays, success: 1 });
    } catch (error) {
      res.send({ found: [], success: 0, error });
    }
  });

  api.post('/api/deleteBirthday', auth, async (req, res) => {
    try {
      if (!req?.body?.birthday_id) {
        return res.send({ success: 0, error: 'Birthday id not found' });
      }

      const result = await db.mongoTransaction('birthdays', async function (coll) {
        return await coll.deleteOne({ _id: db.oid(req?.body?.birthday_id) });
      });

      res.send({ success: 1, result });
    } catch (error) {
      res.send({ success: 0, error });
    }
  });

  api.post('/api/getTelegraphFile', auth, async (req, res) => {
    try {
      if (!req?.body?.file_id) {
        return res.send({ success: 0, error: 'Photo id not found' });
      }

      const imageUrlData = await fetch(await bot.telegram.getFileLink(req?.body?.file_id));
      const imageBase64 = `data:${imageUrlData.headers.get('content-type')};base64,${Buffer.from(await imageUrlData.arrayBuffer()).toString('base64')}`;

      res.send({ file: imageBase64, success: 1 });
    } catch (error) {
      res.send({ file: null, success: 0, error });
    }
  });

  api.post('/api/getUserPhoto', auth, async (req, res) => {
    try {
      if (!req?.body?.user_id) {
        return res.send({ success: 0, error: 'User id not found' });
      }

      const found = await bot.telegram.getUserProfilePhotos(req?.body?.user_id);

      if (found && found?.photos?.length > 1) {
        const use_photo = found?.photos[0]?.[0];

        const imageUrlData = await fetch(await bot.telegram.getFileLink(use_photo?.file_id));
        const imageBase64 = `data:${imageUrlData.headers.get('content-type')};base64,${Buffer.from(await imageUrlData.arrayBuffer()).toString('base64')}`;

        return res.send({ file: imageBase64, success: 1 });
      }

      res.send({ file: null, success: 0, error: 'No pic found' });
    } catch (error) {
      res.send({ file: null, success: 0, error });
    }
  });

  return api;
}

const startWebappServer = (port) => {
  const PORT = port || 3000;

  const app = registerApiRoutes();

  console.log('Starting node server... 🚀');

  // Start the Express server
  const server = app.listen(PORT, () =>
    console.log(`Server listening on port: ${PORT}`)
  );

  // Error handling
  server.on('error', (error) => {
    console.error('Server error:', error);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('Server closed');
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
    .createHash('sha256')
    .update(config.telegraf_key)
    .digest();

  // 4. Computing HMAC for the verification string.
  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  // 5. Comparing the computed HMAC with hash.
  if (computedHash !== hash) {
    return { success: 0, error: 'Verification failed' };
  }

  // 6. Checking the auth_date for its validity.
  const CURRENT_UNIX_TIME = Math.floor(Date.now() / 1000);
  const TIMEOUT_SECONDS = 3600; // Approximately 1 hour
  if (CURRENT_UNIX_TIME - Number(data.auth_date) > TIMEOUT_SECONDS) {
    return { success: 0, error: 'Verification timeout' };
  }

  return { success: 1, message: 'Ok' }
}

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).send({ success: 0, error: 'Missing Authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
      const jwt_res = (jwt.verify(token, config.jwt_secret));
      req.user_id = jwt_res.id;
    } catch (err) {
      return res.status(401).send({ success: 0, error: 'Invalid JWT token' });
    }

    req.token = token;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: 0, error: 'Internal server error' });
  }
};

export default startWebappServer;
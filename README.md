# TheBDayBot
_A simple birthday reminder bot for Telegram._

Want to add it to your group?
Look for [@the_bday_bot](http://t.me/the_bday_bot) on telegram

## Want to host it by yourself?
1. Clone this repository onto your server
```
git clone https://github.com/azzlabs/the_bday_bot.git
```

2. Install all the dependencies - You'll need `npm` installed!
```
npm install
```

3. Copy the contents of `config.json.example` into `config.json` and add your api key (you can create a new bot and obtain a key using [@BotFather](http://t.me/BotFather))

4. You can either run it on the shell with `npm start` or in background using pm2 `pm2 start bday_bot.js`

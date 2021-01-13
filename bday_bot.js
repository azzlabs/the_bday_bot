const Telegraf = require('telegraf');
const config = require('./config.json');
const wishes = require('./birthday_wishes.json');
const CronJob = require('cron').CronJob;
const MongoDB = require('./db_fns.js');
const bot = new Telegraf(config.telegraf_key);
const db = new MongoDB(config);
const months = ['January', 'February', 'March', 'April', 'May', 'JUNe', 'July', 'August', 'September', 'October', 'November', 'December'];
const month_days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var state = {};

// Legacy
// bot.command('fra', (ctx) => { ctx.replyWithMarkdown('-torga culo'); });

// -- "Start" command: gets bot info -- //
bot.command('start', (ctx) => { 
    console.log(ctx.message.from.username + ' called /start');
    ctx.reply(`Everyone can use /add_my_birthday to add their own birthdays.
You can then use /start_alerts to start receiving reminders when it's someone's birthday.
You can see all the other commands using Telegram's bot commands list.`); 
});

// -- "Add birthday" command: sends info and sets data to insert a birthday -- //
bot.command('add_my_birthday', async ctx => {
    console.log('Called /add_my_birthday');

    const user_id = ctx.message.from.id;

    // Check if the birthday is already in the database
    var check = await db.find('birthdays', { chat_id: ctx.message.chat.id, user_id: user_id });

    if (check.length > 0) {
        return ctx.reply('You already told us your birthday.' + "\n" + 'Delete it first if you want to edit your birthday (but y tho?)'); 
    }

    // Sets a temporary state for the player, so it can be read later when a essage is received
    if (!state[user_id]) {
        state[user_id] = {};
    }
    state[user_id].last_command = 'add_bday';

    ctx.replyWithMarkdown('Alright!' + "\n" + 'Hit *reply to this message* and tell us the date. You can use the formats DD/MM/YYYY or just DD/MM if you\'re too old :p');
});

// -- "Delete birthday" command: deletes a birthday record -- //
bot.command('delete_my_birthday', async ctx => {
    console.log('Called /delete_my_birthday');

    db.mongoTransaction('birthdays', async function(coll) {
        return await coll.deleteOne({ chat_id: ctx.message.chat.id, user_id: ctx.message.from.id });
    });

    return ctx.reply('Your birthday has been removed from the list T.T');
});

// -- "All birthdays" command: sends a list of all the birthdays added for a group -- //
bot.command('all_birthdays', async (ctx) => {
    console.log('Called /all_birthdays');

    var the_reply = "Here ya go!\n";
    const result = await db.find('birthdays', { chat_id: ctx.message.chat.id });

    result.forEach(cumple => {
        const name = (cumple.username == null ? cumple.first_name : cumple.username);

        // Format example: "MrUser: 23 December"
        the_reply += `*${name}*: ${padZero(cumple.bday.getDate())} ${months[cumple.bday.getMonth()]}\n`;
    });

    ctx.replyWithMarkdown(the_reply);
});

// -- "Upcoming birthdays" command: sends a short list the last 5 upcoming birthdays added for a group -- //
bot.command('upcoming', async (ctx) => {
    console.log('Called /upcoming');

    var the_reply = "Here ya go!\n";

    // Tries to load 5 birthdays starting from todays date
    var upcoming = await db.mongoTransaction('birthdays', async function(coll) {
        return await coll.find({ $query: { chat_id: ctx.message.chat.id, year_day: { $gt: yearDay(new Date()) } } }).sort({ year_day: 1 }).limit(5).toArray();
    });

    // Loads more birthdays starting from January onwards (bug: might send duplicates if there are less than 5 birthdays)
    if (upcoming.length < 5) {
        var more_cumples = await db.mongoTransaction('birthdays', async function(coll) {
            return await coll.find({ $limit: 2, $query: { chat_id: ctx.message.chat.id } }).sort({ year_day: 1 }).limit(5 - upcoming.length).toArray();
        });
        upcoming = upcoming.concat(more_cumples);
    }

    upcoming.forEach(cumple => {
        const name = (cumple.username == null ? cumple.first_name : cumple.username);

        // Format example: "MrUser: 23 December"
        the_reply += `*${name}*: ${padZero(cumple.bday.getDate())} ${months[cumple.bday.getMonth()]}\n`;
    });

    ctx.replyWithMarkdown(the_reply);
});

// -- "Today's birthdays" command: sends a list with today's birthdays -- //
bot.command('today', async ctx => {
    console.log('Called /today');

    var day_find = yearDay(new Date());

    var birthdays = await db.find('birthdays', { chat_id: ctx.message.chat.id, year_day: day_find });

    // Doing a second check if it's not a leap year (birthdays on the 29th of February will be called on the 28th)
    if (day_find == 59 && !isLeapYear(new Date())) {
        birthdays = birthdays.concat(await db.find('birthdays', { chat_id: grp.chat_id, year_day: day_find + 1 }));
    }

    if (birthdays.length == 0) {
        return ctx.reply('No birthdays today :(');
    }

    await ctx.reply('Here' + (birthdays.length > 1 ? ' are' : '\'s') + ' today\'s birthday' + (birthdays.length > 1 ? 's:' : ':'));

    // Sends a different message for every birthday
    birthdays.forEach(async cumple => {
        const year = cumple.bday.getFullYear();
        const old = (year == 1804 ? '' : `... now ${((new Date().getFullYear()) - year)} years old!`);

        const name = (cumple.username == null ? `*${cumple.first_name}*'s` : `@${cumple.username}'s`);

        // Format example: "@someuser's: 26 November (... now 21 years old! optional) - Happy birthday! 🥳"
        await ctx.reply(`${name}: ${padZero(cumple.bday.getDate())} ${months[cumple.bday.getMonth()]}${old} - Happy birthday! 🥳`);
    });
});

// -- "Start alerts" command: adds the group to the alerts list -- //
bot.command('start_alerts', async ctx => {
    console.log('Called /start_alerts');

    const group = await db.find('groups', { chat_id: ctx.message.chat.id });

    // Checks if the group is already in the database
    if (group.length > 0) {
        return ctx.reply('Hmmm, seems like I\'m already active here!');
    }

    db.mongoTransaction('groups', async function(coll) {
        return await coll.insertOne({ chat_id: ctx.message.chat.id, bot_active: true });
    });

    return ctx.reply('Alright, I\'ll check everyday for birthdays. Stay tuned! ;)');
});

// -- "Stop alerts" command: removes the group from the alerts list -- //
bot.command('stop_alerts', async ctx => {
    console.log('Called /stop_alerts');

    db.mongoTransaction('groups', async function(coll) {
        return await coll.deleteOne({ chat_id: ctx.message.chat.id });
    });

    return ctx.reply('I\'ll no longer check everyday for birthdays :(');
});

// -- Listens for plain text messages from the user. In groups, just replies to the bot are considered. -- //
bot.on('text', async ctx => {
    console.log('Got text!');

    const cur_user_id = ctx.message.from.id;
  
    // Ignores the message if the user has not previusly run the "add birthday" command
    if (!state[cur_user_id]) return;

    if (state[cur_user_id].last_command == 'add_bday') {

        const the_msg = ctx.message.text;
        var the_date = parseDate(the_msg);

        // If the date parsing fails, try to parse the date without the year
        if (the_date == null) {
            the_date = parseDateNoYear(the_msg);

            if (the_date == null) {
                return ctx.reply('Hmmm, that does not seem to be a valid date.' + "\n" + 'You can reply to this message with a valid date');
            }
        }

        db.mongoTransaction('birthdays', async function(coll) {
            return await coll.insertOne({ chat_id: ctx.message.chat.id, 
                                            user_id: cur_user_id, 
                                            username: ctx.message.from.username, 
                                            first_name: ctx.message.from.first_name, 
                                            bday: the_date, 
                                            year_day: yearDay(the_date) });
        });

        // Clears the user temp state
        state[cur_user_id].last_command = null;

        return ctx.reply('Your birthday has been saved succesfully!');
    }
});

// -- The cron job. Runs everyday at 8:30. -- //
const job = new CronJob('30 8 * * *', async function() {
    console.log('Cron job has been fired');

    // Finds all groups
    const groups = await db.find('groups');

    groups.forEach(async grp => {
        var day_find = yearDay(new Date());

        var birthdays = await db.find('birthdays', { chat_id: grp.chat_id, year_day: day_find });

        // Doing a second check if it's not a leap year (birthdays on the 29th of February will be called on the 28th)
        if (day_find == 59 && !isLeapYear(new Date())) {
            birthdays = birthdays.concat(await db.find('birthdays', { chat_id: grp.chat_id, year_day: day_find + 1 }));
        }

        birthdays.forEach(async cumple => {
            const year = cumple.bday.getFullYear();
            const old = (year == 1804 ? '' : ` They're now ${((new Date().getFullYear()) - year)} years old!`);
    
            const name = (cumple.username == null ? `*${cumple.first_name}*'s` : `@${cumple.username}'s`);

            // "Today it's @someuser' birthday. (They're now 21 years old! optional)"
            await bot.telegram.sendMessage(grp.chat_id, `Today it's ${name} birthday.${old}`);
            
            // Selects a random birthday wish from file
            var rand = Math.floor(Math.random() * (wishes.length));
            await bot.telegram.sendMessage(grp.chat_id, `${wishes[rand]} - Happy birthday! 🥳`);
        });
    });
}, null, true, 'Europe/Rome');

// Starts the cron job
job.start();

// To space and beyond
bot.launch();

console.log('Started successfully!');

// -- Utility functions. -- //
function parseDate(str) {
    var m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
      , d = (m) ? new Date(m[3], m[2]-1, m[1]) : null
      , matchesPadded = (d&&(str==[padZero(d.getDate()),padZero(d.getMonth()+1),d.getFullYear()].join('/')))
      , matchesNonPadded = (d&&(str==[d.getDate(),d.getMonth()+1,d.getFullYear()].join('/')));
    return (matchesPadded || matchesNonPadded) ? d : null;
}

function parseDateNoYear(str) {
    var m = str.match(/^(\d{1,2})\/(\d{1,2})$/)
      , d = ((m) ? new Date(1804, m[2]-1, m[1]) : null)
      , matchesPadded = (d && (str == [padZero(d.getDate()), padZero(d.getMonth()+1)].join('/')))
      , matchesNonPadded = (d && (str == [d.getDate(), d.getMonth() + 1].join('/')));
    return (matchesPadded || matchesNonPadded) ? d : null;
}

function padZero(x) { 
    return ((('' + x).length == 2) ? '' : '0') + x; 
}

// -- Given a date object, returns the number of days elapsed from January 1st of the give year -- //
function yearDay(date) {
    var the_day = date.getDate();
    for (var i = 0; i < date.getMonth(); i++) {
        the_day += month_days[i];
    }
    return the_day;
}

// -- Given a date object, returns whether or not it's a leap year -- //
function isLeapYear(date) {
    year = date.getFullYear();
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}
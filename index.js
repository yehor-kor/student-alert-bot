const telegramAPI = require('node-telegram-bot-api');
const fs = require('fs');

require('dotenv').config();

const token = process.env.TOKEN; // my tg bot`s API token 
const botUsername = process.env.BOT_USERNAME; // my tg bot`s username
const ownerUsername = process.env.OWNER_USERNAME; // my own username
const ownerID = process.env.OWNER_ID; // my tg chat`s code number
const channelID = process.env.CHANNEL_ID; // my tg channel`s code number
const bot = new telegramAPI(token, { polling: true }); // my tg bot

const musicOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: 'completed.ogg', callback_data: '/completed' },
        { text: 'hellobiden.ogg', callback_data: '/hellobiden' }
      ],
      [
        { text: 'lightoff.ogg', callback_data: '/lightoff' },
        { text: 'shiza.ogg', callback_data: '/shiza' }
      ],
      [
        { text: 'victory.ogg', callback_data: '/victory' },
        { text: 'chocolate.mp3', callback_data: '/chocolate' }
      ],
      [
        { text: 'donbass.mp3', callback_data: '/donbass' },
        { text: 'probitie.mp3', callback_data: '/probitie' }
      ]
    ]
  })
};

const start = () => {
  let keywords = require('./keywords.json');
  let alertMessage = '🔴 Увага! Перекличка, пройдіть на заняття!\n';
  let clearMessage = '🟢 Перекличка закінчилася, лягайте спати.\n';
  let selfMessage = '⚡️ Увага! Самовідмітка на занятті доступна протягом 15 хвилин.\n';
  let isFirstTime = true;
  let isSettingKeyword = false;
  let isSettingAlert = false;
  let isSecretMessage = false;

  bot.setMyCommands([
    { command: '/start', description: 'Start bot or do secret' },
    { command: '/alert', description: 'Play an alert sound' },
    { command: '/clear', description: 'Play an all-clear sound' },
    { command: '/self', description: 'Play an self-marking sound' },
    { command: '/cum', description: 'Play a funny gif' },
    { command: '/music', description: 'Show a music menu' },
    { command: '/random', description: 'Generate a random number from 1 to 6' },
    { command: '/grade', description: 'Get a random grade' },
    { command: '/setalert', description: 'Set any alert message whatever you want' },
    { command: '/addkeyword', description: 'Add any keyword whatever you want' },
    { command: '/showkeywords', description: 'Show a list of all selected keywords' },
    { command: '/sendsecret', description: 'Send a message to developer' }
  ]);

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatID = msg.chat.id;

    console.log('------------------------------');
    console.log(msg.chat.title); // view info about chat
    console.log(`text: ${text}`); // view text in messages

    const isCommand = (command) => {
      return text === command || text === command + botUsername;
    }

    const isKeyword = (word) => {
      keywords = require('./keywords.json');

      if (word === undefined) return false;

      for (let i = 0; i < keywords.length; i++) {
        if (keywords[i] === word.toLowerCase()) {
          return true;
        }
      }

      return false;
    }

    const getCurrentTime = () => {
      const d = new Date();

      let h = d.getHours();
      let m = d.getMinutes();
      let s = d.getSeconds();

      let hours = h < 10 ? '0' + h : h;
      let minutes = m < 10 ? '0' + m : m;
      let seconds = s < 10 ? '0' + s : s;

      return `${hours}:${minutes}:${seconds}`;
    }
    
    if (isCommand('/alert') || isKeyword(text)) {
      let timeMessage = `Стартувала о ${getCurrentTime()}`;
      await bot.sendVoice(chatID, './sounds/alert.ogg');
      await bot.sendMessage(chatID, alertMessage + timeMessage);
    }
    
    else if (isCommand('/clear')) {
      let timeMessage = `Закінчилася о ${getCurrentTime()}`;
      await bot.sendAudio(chatID, './sounds/probitie.mp3');
      await bot.sendMessage(chatID, clearMessage + timeMessage);
    }
    
    else if (isCommand('/self')) {
      await bot.sendVoice(chatID, './sounds/victory.ogg');
      await bot.sendMessage(chatID, selfMessage);
    }
    
    else if (isCommand('/cum')) {
      await bot.sendAnimation(chatID, './videos/cum.mp4');
    }
    
    else if (
      isCommand('/completed') ||
      isCommand('/hellobiden') ||
      isCommand('/lightoff') ||
      isCommand('/shiza') ||
      isCommand('/victory')
    ) {
      await bot.sendVoice(chatID, `./sounds${text}.ogg`);
    }
    
    else if (
      isCommand('/chocolate') ||
      isCommand('/donbass') ||
      isCommand('/probitie')
    ) {
      await bot.sendAudio(chatID, `./sounds${text}.mp3`);
    }
      
    else if (isCommand('/music')) {
      await bot.sendMessage(
        chatID,
        '-----------------------Music Menu---------------',
        musicOptions
      );
    }
    
    else if (isSettingKeyword) {
      isSettingKeyword = false;

      if (!isKeyword(text)) {
        fs.readFile('./keywords.json', 'utf8', (err, jsonString) => {
          if (err) {
            console.log('File read failed:', err);
            return;
          }

          console.log('File data:', jsonString);
          jsonArray = JSON.parse(jsonString);
          jsonArray.push(text.toLowerCase());
          
          const jsonStringNew = JSON.stringify(jsonArray);

          fs.writeFile('./keywords.json', jsonStringNew, (err) => {
            if (err) {
              console.log('Error writing file:', err);
            } else {
              console.log('Successfully wrote file.');
            }
          });
        });

        await bot.sendMessage(
          chatID,
          'Okay, all right. A new keyword was added.'
        );
      }
      
      else if (isKeyword(text)) {
        await bot.sendMessage(
          chatID,
          'Oh shit, canceled. A new keyword and an old keyword are the same!'
        );
      }
    }
    
    else if (isSettingAlert) {
      isSettingAlert = false;

      if (alertMessage !== text) {
        alertMessage = text;
        await bot.sendMessage(
          chatID,
          'Okay, all right. A new alert message was set.'
        );
      }
      
      else if (alertMessage === text) {
        await bot.sendMessage(
          chatID,
          'Oh shit, canceled. A new alert message and an old alert message are the same!'
        );
      }
    }
    
    else if (isCommand('/start') && isFirstTime) {
      isFirstTime = false;
      await bot.sendMessage(
        chatID,
        `Hello and welcome to Pereklichka bot!\nDeveloped by ${ownerUsername}`
      );
    }
    
    else if (isCommand('/start') && !isFirstTime) {
      await bot.sendMessage(chatID, `Hi! I am still here.`);
    }
    
    else if (isCommand('/start alert')) {
      let timeMessage = `Стартувала о ${getCurrentTime()}`;
      await bot.sendMessage(channelID, alertMessage + timeMessage);
    }
    
    else if (isCommand('/start clear')) {
      let timeMessage = `Закінчилася о ${getCurrentTime()}`;
      await bot.sendMessage(channelID, clearMessage + timeMessage);
    }
    
    else if (isCommand('/start self')) {
      await bot.sendMessage(channelID, selfMessage);
    }
    
    else if (isCommand('/random')) {
      msg = await bot.sendDice(chatID);
      let randomNumber = msg.dice.value;
      await bot.sendMessage(chatID, randomNumber);
    }
    
    else if (isCommand('/grade')) {
      let randomGrade = Math.round(Math.random() * 100); // range [0; 100]
      await bot.sendMessage(
        chatID,
        `${msg.from.first_name} aka @${msg.from.username} has a ${randomGrade} grade!`
      );
    }
    
    else if (isCommand('/showkeywords')) {
      await bot.sendMessage(
        chatID,
        'Okay, I am displaying a list of selected keywords:'
      );

      for (let i = 0; i < keywords.length; i++) {
        await bot.sendMessage(chatID, `(${i + 1}) - ${keywords[i]}`);
      }
    }
    
    else if (isCommand('/addkeyword')) {
      isSettingKeyword = true;
      await bot.sendMessage(
        chatID,
        'Please, send me any new keyword to turn on alarm.'
      );
    }
    
    else if (isCommand('/setalert')) {
      isSettingAlert = true;
      await bot.sendMessage(chatID, 'Please, send me any new alert message.');
    }
    
    else if (isCommand('/sendsecret')) {
      isSecretMessage = true;
      await bot.sendMessage(
        chatID,
        'Please, send me any text message, I will deliver that to owner of this bot.'
      );
    }
    
    else if (isSecretMessage) {
      isSecretMessage = false;
      await bot.sendMessage(chatID, 'The text message has been sent.');
      await bot.sendMessage(
        ownerID,
        `Secret message from ${msg.from.first_name} ${msg.from.last_name} aka @${msg.from.username}\n${text}`
      );
    }
  });

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatID = msg.message.chat.id; ////

    const isCommand = (command) => {
      return data === command;
    }

    if (
      isCommand('/completed') ||
      isCommand('/hellobiden') ||
      isCommand('/lightoff') ||
      isCommand('/shiza') ||
      isCommand('/victory')
    ) {
      await bot.sendVoice(chatID, `./sounds${data}.ogg`);
    }
  
    else if (
      isCommand('/chocolate') ||
      isCommand('/donbass') ||
      isCommand('/probitie')
    ) {
      await bot.sendAudio(chatID, `./sounds${data}.mp3`);
    }
  });

};

start();

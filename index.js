const telegramAPI = require('node-telegram-bot-api');
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');

require('dotenv').config();

const tgBotToken = '6086564316:AAGEjAwqzpJWL-pIxpdrFO-mqng3QHTEeNI';
const configuration = new Configuration({
  apiKey: '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', // my openAI API token
});

const tgBotUsername = process.env.TG_BOT_USERNAME; // my tg bot`s username
const ownerUsername = process.env.OWNER_USERNAME; // my own username
const ownerID = +process.env.OWNER_ID; // my tg chat`s code number
const channelID = +process.env.CHANNEL_ID; // my tg channel`s code number

const bot = new telegramAPI(tgBotToken, { polling: true }); // my tg bot
const openai = new OpenAIApi(configuration); // my openAI API client

const start = () => {
  let keywords = require('./keywords.json');
  let alertMessage = '🔴 Увага! Перекличка, пройдіть на заняття!\n';
  let clearMessage = '🟢 Перекличка закінчилася, лягайте спати.\n';
  let selfMessage = '⚡️ Увага! Самовідмітка на занятті доступна протягом 15 хвилин.\n';
  let isFirstTime = true;
  let isAskedText = false;
  let isAskedImage = false;
  let isSettingKeyword = false;
  let isSettingAlert = false;
  let isSecretMessage = false;

  bot.setMyCommands([
    { command: '/start', description: 'Start bot or do secret' },
    { command: '/chatgpt', description: 'Get all answers of the world with ChatGPT' },
    { command: '/chatgptimg', description: 'Get all images of the world with ChatGPT' },
    { command: '/alert', description: 'Play an alert sound' },
    { command: '/clear', description: 'Play an all-clear sound' },
    { command: '/airalerton', description: 'Sign on air alert'},
    { command: '/airalertoff', description: 'Sign off air alert'},
    { command: '/self', description: 'Play an self-marking sound' },
    { command: '/music', description: 'Show a music menu' },
    { command: '/cum', description: 'Play a funny gif' },
    { command: '/random', description: 'Generate a random number from 1 to 6' },
    { command: '/grade', description: 'Get a random grade in 100-rate system' },
    { command: '/banana', description: 'Get a random length of banana' },
    { command: '/setalert', description: 'Set any alert message whatever you want' },
    { command: '/addkeyword', description: 'Add any keyword whatever you want' },
    { command: '/showkeywords', description: 'Show a list of all selected keywords' },
    { command: '/sendsecret', description: 'Send a message to developer' }
  ]);

  const musicOptions = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: 'completed.ogg', callback_data: '/completed' },
          { text: 'hellobiden.ogg', callback_data: '/hellobiden' },
        ],
        [
          { text: 'lightoff.ogg', callback_data: '/lightoff' },
          { text: 'shiza.ogg', callback_data: '/shiza' },
        ],
        [
          { text: 'victory.ogg', callback_data: '/victory' },
          { text: 'chocolate.mp3', callback_data: '/chocolate' },
        ],
        [
          { text: 'donbass.mp3', callback_data: '/donbass' },
          { text: 'probitie.mp3', callback_data: '/probitie' },
        ],
      ],
    }),
  };

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatID = msg.message.chat.id;

    const isCommand = (command) => {
      return data === command;
    };

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

    await bot.answerCallbackQuery(msg.id, `${data}`);
  });

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatID = msg.chat.id;
    const chatTitle = msg.chat.title;
    const firstName = msg.from.first_name;
    const lastName = msg.from.last_name;
    const username = msg.from.username;
    const date = msg.date;
    const time = new Date(date * 1000);
    const airAlertStatus = true;

    const viewInfo = () => {
      console.log('------------------------------');
      // view info about chat
      console.log(chatTitle !== undefined ? chatTitle : chatID);
      // view info about user
      console.log(`${firstName}${lastName !== undefined ? ' ' + lastName : ''}${username !== undefined ? ' ( @' + username + ' )' : ''}`);
      // show time
      console.log(`${time.toGMTString()}\n${time.toLocaleString()}`);
      // show message type
      console.log(`type: ${msg.entities !== undefined ? msg.entities[0].type : 'default_message'}`);
      // view text in messages
      console.log(`text: ${text}`);
    }

    const isCommand = (command) => {
      return text === command || text === command + tgBotUsername;
    }

    const deleteMessage = (chat = chatID) => {
      const messageID = msg.message_id.toString();
      bot.deleteMessage(chat, messageID);
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

      let h = d.getHours() + 2; // London Server little fix
      let m = d.getMinutes();
      let s = d.getSeconds();

      let hours = h < 10 ? '0' + h : h;
      let minutes = m < 10 ? '0' + m : m;
      let seconds = s < 10 ? '0' + s : s;

      return `${hours}:${minutes}:${seconds}`;
    }

    viewInfo();

    if (!airAlertStatus) {
      const city = "#Київська_область"; // selected city for alert
      const channelID = -1001766138888;
      const messageID = 1234;

      await bot.forwardMessage(chatID, channelID, messageID);
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

    else if (isCommand('/airalerton')) {
      airAlertStatus = true;
    }

    else if (isCommand('/airalerton')) {
      airAlertStatus = false;
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
        '-------------------Music Menu---------------',
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
        `Hello and welcome to StudentAlert bot!\nDeveloped by ${ownerUsername}`
      );
    }
    
    else if (isCommand('/start') && !isFirstTime) {
      await bot.sendMessage(chatID, `Hi! I am still here.`);
    }
    
    else if (isCommand('/start alert')) {
      deleteMessage();
      let timeMessage = `Стартувала о ${getCurrentTime()}`;
      await bot.sendMessage(channelID, alertMessage + timeMessage);
    }
    
    else if (isCommand('/start clear')) {
      deleteMessage();
      let timeMessage = `Закінчилася о ${getCurrentTime()}`;
      await bot.sendMessage(channelID, clearMessage + timeMessage);
    }
    
    else if (isCommand('/start self')) {
      deleteMessage();
      await bot.sendMessage(channelID, selfMessage);
    }
    
    else if (isCommand('/chatgpt') && !isAskedText) {
      isAskedText = true;
      let randomNumber = Math.round(Math.random() * 99 + 1); // range [1; 100]
      await bot.sendAnimation(chatID, `./videos/${randomNumber}.mp4`);
      await bot.sendMessage(chatID, 'Hello from ChatGPT! Please, send me a question message and I will find an info for you.');
    }
    
    else if (isCommand('/chatgptimg') && !isAskedImage) {
      isAskedImage = true;
      let randomNumber = Math.round(Math.random() * 99 + 1); // range [1; 100]
      await bot.sendAnimation(chatID, `./videos/${randomNumber}.mp4`);
      await bot.sendMessage(chatID, 'Hello from ChatGPT! Please, send me a question message and I will find an image for you.');
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
        `${firstName}${username !== undefined ? ' aka @' + username : ''} has a ${randomGrade} / 100 grade!`
      );
    }
      
    else if (isCommand('/banana')) {
      let randomLength = Math.round(Math.random() * 30); // range [0; 30]
      await bot.sendMessage(
        chatID,
        `${firstName}${username !== undefined ? ' aka @' + username : ''} has a ${randomLength}cm banana!`
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
    
    else if (isAskedText) {
      isAskedText = false;
      const request = text;

      try {
        const response = openai.createCompletion({
          model: 'text-davinci-003',
          prompt: request, // prompt: asked message
          temperature: 0.5,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          max_tokens: 1024,
        });

        response.then((data) => {
          bot.sendMessage(chatID, `ChatGPT:${data.data.choices[0].text}`);
        });
      } catch (error) {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
      }
    }
      
    else if (isAskedImage) {
      isAskedImage = false;
      const request = text;

      try {
        const response = openai.createImage({
          prompt: request, // prompt: asked message
          n: 1,
          size: "512x512",
        });

        response.then((data) => {
          bot.sendMessage(chatID, `ChatGPT:\n\n${data.data.data[0].url}`);
        });
      } catch (error) {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
      }
    }
    
    else if (isSecretMessage) {
      isSecretMessage = false;
      await bot.sendMessage(chatID, 'The text message has been sent.');
      await bot.sendMessage(
        ownerID,
        `Secret message from ${firstName}${lastName !== undefined ? ' ' + lastName : ''}${username !== undefined ? ' aka @' + username : ''}\n${text}`
      );
    }
  });
};

start();

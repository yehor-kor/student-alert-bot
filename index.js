const telegramAPI = require("node-telegram-bot-api");
const token = "6086564316:AAHx98sqw7rwWPLlXmRr2tKx_mJKK6RNUkI";
const bot = new telegramAPI(token, { polling: true });

const start = () => {
  let isFirstTime = true;
  let isSetting = false;
  let isSecretMessage = false;
  let keyword = "ПЕРЕКЛИЧКА";

  bot.setMyCommands([
    { command: "/start", description: "Start bot" },
    { command: "/alert", description: "Play an alert sound" },
    { command: "/completed", description: "Play a funny sound 1" },
    { command: "/lightoff", description: "Play a funny sound 2" },
    { command: "/shiza", description: "Play a funny sound 3" },
    { command: "/victory", description: "Play a funny sound 4" },
    { command: "/random", description: "Generate a random number from 1 to 6" },
    { command: "/grade", description: "Get a random grade" },
    { command: "/setkeyword", description: "Set any keyword whatever you want" },
    { command: "/sendsecret", description: "Send a message to developer" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatID = msg.chat.id;

    console.log(msg);

    if (text === keyword || text === "/alert" || text === "/alert@student_alert_bot") {
      await bot.sendMessage(chatID, "🔴 ALERT, suka blyat");
      await bot.sendVoice(chatID, "./sounds/alert.ogg");
    }

    else if (text === "/completed" || text === "/completed@student_alert_bot") {
      await bot.sendVoice(chatID, "./sounds/completed.ogg");
    }
    
    else if (text === "/lightoff" || text === "/lightoff@student_alert_bot") {
      await bot.sendVoice(chatID, "./sounds/light_off.ogg");
    }
    
    else if (text === "/shiza" || text === "/shiza@student_alert_bot") {
      await bot.sendVoice(chatID, "./sounds/shiza.ogg");
    }
    
    else if (text === "/victory" || text === "/victory@student_alert_bot") {
      await bot.sendVoice(chatID, "./sounds/victory.ogg");
    }
    
    else if (text !== keyword && isSetting) {
      isSetting = false;
      keyword = text;
      await bot.sendMessage(
        chatID,
        "Okay, all right. A new keyword was added."
      );
    }
    
    else if (text === keyword && isSetting) {
      isSetting = false;
      await bot.sendMessage(
        chatID,
        "Oh shit, canceled. A new keyword and an old keyword are the same!"
      );
    }

    else if (text === "/start" || text === "/start@student_alert_bot" && isFirstTime) {
      isFirstTime = false;
      await bot.sendMessage(
        chatID,
        "Hello and welcome to Pereklichka bot!\nDeveloped by @yehor_kor"
      );
    }

    else if (text === "/start" || text === "/start@student_alert_bot" && !isFirstTime) {
      await bot.sendMessage(chatID, "Hi! I am still here.");
    }
    
    else if (text === "/random" || text === "/random@student_alert_bot") {
      msg = await bot.sendDice(chatID);
      let randomNumber = msg.dice.value;
      await bot.sendMessage(chatID, randomNumber);
    }
    
    else if (text === "/grade" || text === "/grade@student_alert_bot") {
      let randomGrade = Math.floor(Math.random() * 40 + 60); // range [60; 100]
      await bot.sendMessage(
        chatID,
        `${msg.from.first_name} aka @${msg.from.username} has a ${randomGrade} grade!`
      );
    }
    
    else if (text === "/setkeyword" || text === "/setkeyword@student_alert_bot") {
      isSetting = true;
      await bot.sendMessage(
        chatID,
        "Please, send me any new keyword to turn on alarm."
      );
    }
    
    else if (text === "/sendsecret" || text === "/sendsecret@student_alert_bot") {
      isSecretMessage = true;
      await bot.sendMessage(
        chatID,
        "Please, send me any text message, I will deliver that to owner of this bot."
      );
    }
    
    else if (isSecretMessage) {
      isSecretMessage = false;
      await bot.sendMessage(
        chatID,
        "The text message has been sent."
      );
      await bot.sendMessage(
        // my tg chat`s code number
        724669680,
        `Secret message from ${msg.from.first_name} ${msg.from.last_name} aka @${msg.from.username}\n${text}`
      );
    }
    
    else {
      await bot.sendMessage(chatID, "go nahui nubip");
    }
  });
};

start();

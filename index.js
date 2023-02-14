const telegramAPI = require("node-telegram-bot-api");
const fs = require("fs"); 

require("dotenv").config();

const tag = process.env.TAG; // my tg bot`s username tag
const token = process.env.TOKEN; // my tg bot`s API token 
const ownerNumber = process.env.OWNER_NUMBER; // my tg chat`s code number
const bot = new telegramAPI(token, { polling: true }); // my tg bot

const start = () => {
  let keywords = require("./keywords.json");
  let alertMessage = "🔴 ALERT, suka blyat";
  let isFirstTime = true;
  let isSettingKeyword = false;
  let isSettingAlert = false;
  let isSecretMessage = false;

  bot.setMyCommands([
    { command: "/start", description: "Start bot" },
    { command: "/alert", description: "Play an alert sound" },
    { command: "/cum", description: "Play a funny gif" },
    { command: "/completed", description: "Play a funny sound 1" },
    { command: "/lightoff", description: "Play a funny sound 2" },
    { command: "/shiza", description: "Play a funny sound 3" },
    { command: "/victory", description: "Play a funny sound 4" },
    { command: "/donbass", description: "Play a funny sound 5" },
    { command: "/8let", description: "Play a funny sound 6" },
    { command: "/hellobiden", description: "Play a funny sound 7" },
    { command: "/probitie", description: "Play a funny sound 8" },
    { command: "/chocolate", description: "Play a funny sound 9" },
    { command: "/random", description: "Generate a random number from 1 to 6" },
    { command: "/grade", description: "Get a random grade" },
    { command: "/showkeywords", description: "Show a list of all selected keywords" },
    { command: "/addkeyword", description: "Add any keyword whatever you want" },
    { command: "/setalert", description: "Set any alert message whatever you want" },
    { command: "/sendsecret", description: "Send a message to developer" }
  ]);

  bot.on("message", async (msg) => {
    console.log(msg); // view info about messages

    const text = msg.text;
    const chatID = msg.chat.id;

    const isCommand = (command) => {
      return text === command || text === command + tag;
    }

    const isKeyword = (word) => {
      keywords = require("./keywords.json");

      if (word === undefined) return false;

      for (let i = 0; i < keywords.length; i++) {
        if (keywords[i] === word.toLowerCase()) {
          return true;
        }
      }

      return false;
    }
    
    if (isCommand("/alert") || isKeyword(text)) {
      await bot.sendVoice(chatID, "./sounds/alert.ogg");
      await bot.sendMessage(chatID, alertMessage);
    }
    
    if (isCommand("/cum")) {
      await bot.sendAnimation(chatID, "./gifs/cum.mp4")
    }
    
    else if (isCommand("/completed")) {
      await bot.sendVoice(chatID, "./sounds/completed.ogg");
    }
    
    else if (isCommand("/lightoff")) {
      await bot.sendVoice(chatID, "./sounds/light_off.ogg");
    }
    
    else if (isCommand("/shiza")) {
      await bot.sendVoice(chatID, "./sounds/shiza.ogg");
    }
    
    else if (isCommand("/victory")) {
      await bot.sendVoice(chatID, "./sounds/victory.ogg");
    }
    
    else if (isCommand("/donbass")) {
      await bot.sendVoice(chatID, "./sounds/donbass.ogg");
    }
    
    else if (isCommand("/8let")) {
      await bot.sendVoice(chatID, "./sounds/8_let.ogg");
    }
    
    else if (isCommand("/hellobiden")) {
      await bot.sendVoice(chatID, "./sounds/hello_biden.ogg");
    }
    
    else if (isCommand("/probitie")) {
      await bot.sendAudio(chatID, "./sounds/probitie.mp3");
    }
    
    else if (isCommand("/chocolate")) {
      await bot.sendAudio(chatID, "./sounds/chocolate.mp3");
    }
    
    else if (isSettingKeyword) {
      isSettingKeyword = false;

      if (!isKeyword(text)) {
        fs.readFile("./keywords.json", "utf8", (err, jsonString) => {
          if (err) {
            console.log("File read failed:", err);
            return;
          }

          console.log("File data:", jsonString);
          jsonArray = JSON.parse(jsonString);
          jsonArray.push(text.toLowerCase());
          
          const jsonStringNew = JSON.stringify(jsonArray);

          fs.writeFile("./keywords.json", jsonStringNew, (err) => {
            if (err) {
              console.log("Error writing file:", err);
            } else {
              console.log("Successfully wrote file.");
            }
          });
        });

        await bot.sendMessage(
          chatID,
          "Okay, all right. A new keyword was added."
        );
      }
      
      else if (isKeyword(text)) {
        await bot.sendMessage(
          chatID,
          "Oh shit, canceled. A new keyword and an old keyword are the same!"
        );
      }
    }
    
    else if (isSettingAlert) {
      isSettingAlert = false;

      if (alertMessage !== text) {
        alertMessage = text;
        await bot.sendMessage(
          chatID,
          "Okay, all right. A new alert message was set."
        );
      }
      
      else if (alertMessage === text) {
        await bot.sendMessage(
          chatID,
          "Oh shit, canceled. A new alert message and an old alert message are the same!"
        );
      }
    }
    
    else if (isCommand("/start") && isFirstTime) {
      isFirstTime = false;
      await bot.sendMessage(
        chatID,
        "Hello and welcome to Pereklichka bot!\nDeveloped by @yehor_kor"
      );
    }
    
    else if (isCommand("/start") && !isFirstTime) {
      await bot.sendMessage(chatID, "Hi! I am still here.");
    }
    
    else if (isCommand("/random")) {
      msg = await bot.sendDice(chatID);
      let randomNumber = msg.dice.value;
      await bot.sendMessage(chatID, randomNumber);
    }
    
    else if (isCommand("/grade")) {
      let randomGrade = Math.round(Math.random() * 40 + 60); // range [60; 100]
      await bot.sendMessage(
        chatID,
        `${msg.from.first_name} aka @${msg.from.username} has a ${randomGrade} grade!`
      );
    }
    
    else if (isCommand("/showkeywords")) {
      await bot.sendMessage(
        chatID,
        "Okay, I am displaying a list of selected keywords:"
      );

      for (let i = 0; i < keywords.length; i++) {
        await bot.sendMessage(chatID, `(${i + 1}) - ${keywords[i]}`);
      }
    }
    
    else if (isCommand("/addkeyword")) {
      isSettingKeyword = true;
      await bot.sendMessage(
        chatID,
        "Please, send me any new keyword to turn on alarm."
      );
    }
    
    else if (isCommand("/setalert")) {
      isSettingAlert = true;
      await bot.sendMessage(chatID, "Please, send me any new alert message.");
    }
    
    else if (isCommand("/sendsecret")) {
      isSecretMessage = true;
      await bot.sendMessage(
        chatID,
        "Please, send me any text message, I will deliver that to owner of this bot."
      );
    }
    
    else if (isSecretMessage) {
      isSecretMessage = false;
      await bot.sendMessage(chatID, "The text message has been sent.");
      await bot.sendMessage(
        ownerNumber,
        `Secret message from ${msg.from.first_name} ${msg.from.last_name} aka @${msg.from.username}\n${text}`
      );
    }
  });
};

start();

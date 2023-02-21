# student-alert-bot

## Overview

<img src="https://user-images.githubusercontent.com/108824413/220249162-77447975-7c4b-42cd-ba69-b3442241e113.svg" alt="ChatGPT logo" width="75"> <img src="https://user-images.githubusercontent.com/108824413/220250060-1c271734-29ba-4252-b2b1-c839d3a22336.png" alt="Telegram logo" width="75">

<img src="https://user-images.githubusercontent.com/108824413/220239186-cd2190da-b008-410a-976a-2fbf20b3f2a0.png" alt="Check" width="150">

- [StudentAlert - my bot in Telegram](https://t.me/student_alert_bot "StudentAlert bot")
- [Info KN-1 - my channel in Telegram](https://t.me/infostudentalert "Info Student Alert tg-channel")

## Description

**StudentAlert bot for sending alert to students in the popular world messenger Telegram.**

The bot was written only in Javascript with the power of NodeJS. 

Also this creation can help you interact with ChatGPT in Telegram, cool right? 

Messaging with ChatGPT is provided via Openai API.

<img src="https://user-images.githubusercontent.com/108824413/220250576-5ab93724-d2e8-41dd-bc61-31d5d248b54a.jpg" alt="ChatGPT" width="600">

## Before you start development

1. Download packages

- Run a command in your terminal: ```npm install``` or ```npm i```

- After successful downloading required packages for project, you are ready to start.

2. Go to BotFather in Telegram and create a new bot (you need this for get token for your bot)

- [BotFather in Telegram](https://t.me/BotFather "BotFather bot")

3. Create .env file in the root path of project

- After creating a file, open that and write this structure:

```
TG_BOT_TOKEN = "<your-tg-bot-token>"
OPENAI_API_TOKEN = "<your-openai-api-token>"
TG_BOT_USERNAME = "<@bot-tg-nickname>"
OWNER_USERNAME = "<@your-tg-nickname>"
OWNER_ID = "<your-id-number-in-tg>"
CHANNEL_ID = "<channel-id-number-in-tg>"
```

- Replace tokens at text above on your tokens and nicknames and numbers.

## Start working on the local server

- Start for development: ```npm run dev```

- Start for production: ```npm start```

<img src="https://user-images.githubusercontent.com/108824413/220239086-44c21d40-796d-499c-a99f-745905b4c124.gif" alt="Notification bell solid" width="400">

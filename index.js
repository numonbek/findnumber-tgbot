const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');

const token = '5110839841:AAG0oJ0UNbzOtEZ1xkT9fmB09VoKKIn96do';

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Find thinking number from 0 to 9`);
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  console.log(chats[chatId]);
  await bot.sendMessage(chatId, `Say Number`, gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Start Description' },
    { command: '/info', description: 'Get Information' },
    { command: '/game', description: 'Get Information' },
  ]);

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === `/start`) {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/f4e/13e/f4e13ef5-78c3-327d-bacf-fbdad210806e/9.webp',
      );
      return bot.sendMessage(chatId, `Hello Bro ${text}`);
    }
    if (text === `/info`) {
      return bot.sendMessage(chatId, `Your Name ${msg.from.first_name} ${msg.from.last_name}`);
    }
    console.log(msg);

    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, `I don't know what do you want`);
  });
  bot.on('callback_query', (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId);
    }

    if (data == chats[chatId]) {
      return bot.sendMessage(chatId, `Win You Find Number: ${chats[chatId]}`, againOptions);
    } else {
      return bot.sendMessage(chatId, `You Can't Find Number(, Number Is: ${data}`, againOptions);
    }

    bot.sendMessage(chatId, `You check Number ${data}`);
    console.log(msg);
  });
};

start();

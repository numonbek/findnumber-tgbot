const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');
const sequelize = require('./db');
const UserModel = require('./models');

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

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch {
    console.log('Error DB');
  }

  bot.setMyCommands([
    { command: '/start', description: 'Start Description' },
    { command: '/info', description: 'Get Information' },
    { command: '/game', description: 'Get Information' },
  ]);

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    try {
      if (text === `/start`) {
        await UserModel.create({ chatId });
        await bot.sendSticker(
          chatId,
          'https://tlgrm.ru/_/stickers/f4e/13e/f4e13ef5-78c3-327d-bacf-fbdad210806e/9.webp',
        );
        return bot.sendMessage(chatId, `Hello Bro ${text}`);
      }
      if (text === `/info`) {
        const user = await UserModel.findOne({ chatId });
        return bot.sendMessage(
          chatId,
          `Your Name ${msg.from.first_name} ${msg.from.last_name}, Right answers: ${user.right}, wrongs: ${user.wrong}`,
        );
      }
      console.log(msg);

      if (text === '/game') {
        return startGame(chatId);
      }

      return bot.sendMessage(chatId, `I don't know what do you want`);
    } catch {
      return bot.sendMessage(chatId, 'Error Message');
    }
  });
  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId);
    }

    const user = await UserModel.findOne({ chatId });

    if (data == chats[chatId]) {
      user.right += 1;
      await bot.sendMessage(chatId, `Win You Find Number: ${chats[chatId]}`, againOptions);
    } else {
      user.wrong += 1;
      await bot.sendMessage(chatId, `You Can't Find Number(, Number Is: ${data}`, againOptions);
    }
    await user.save();
    // bot.sendMessage(chatId, `You check Number ${data}`);
    // console.log(msg);
  });
};

start();

const { Sequelize } = require('sequelize');

module.exports = new Sequelize('telegabot', 'root', 'root', {
  host: 'master.7e4ad064-0010-452d-a66a-c95d8ffc6154.c.dbaas.selcloud.ru',
  port: '6432',
  dialect: 'postgres',
});

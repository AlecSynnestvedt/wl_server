const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:Letmein1234!@localhost:5432/workout-log");

module.exports = sequelize;
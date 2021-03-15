const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(path.dirname(path.dirname(__dirname)), 'data.sqlite'),
  logging: console.log,
});

const User = sequelize.define(
  'User',
  {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  {
    tableName: 'users',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

const Bookmark = sequelize.define(
  'Bookmark',
  {
    url: DataTypes.STRING,
    title: DataTypes.STRING,
  },
  {
    tableName: 'bookmarks',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = {
  sequelize,
  User,
  Bookmark,
};

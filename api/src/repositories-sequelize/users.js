const bcrypt = require('bcrypt');
const { User } = require('./sequelize');

function withoutPassword(user) {
  const userWithoutPassword = Object.assign({}, user);
  delete userWithoutPassword.password;
  return userWithoutPassword;
}

async function login(username, password) {
  // implement
}

async function get(id) {
  // implement
}

module.exports = {
  login,
  get,
};

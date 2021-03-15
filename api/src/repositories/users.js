const bcrypt = require('bcrypt');
const kv = require('./kv');

const key = 'users';

async function getAll() {
  return (await kv.get(key)) || [];
}

function withoutPassword(user) {
  const userWithoutPassword = Object.assign({}, user);
  delete userWithoutPassword.password;
  return userWithoutPassword;
}

async function login(username, password) {
  const user = (await getAll()).find((user) => user.username === username);
  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      return withoutPassword(user);
    }
  }
}

async function get(id) {
  const user = (await getAll()).find((user) => user.id === id);
  if (user) {
    return withoutPassword(user);
  }
}

module.exports = {
  login,
  get,
};

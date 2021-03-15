const { Bookmark, User } = require('./sequelize');

async function getAll() {
  return (await Bookmark.findAll()).map((bookmark) => bookmark.toJSON());
}

async function get(id) {
  // implement
}

async function create(bookmark) {
  // implement
}

async function update(id, bookmark) {
  // implement
}

async function del(id) {
  // implement
}

module.exports = {
  getAll,
  get,
  create,
  update,
  delete: del,
};

const { Bookmark } = require('./sequelize');

async function getAll() {
  return (await Bookmark.findAll()).map((bookmark) => bookmark.toJSON());
}

async function get(id) {
  const bookmark = await Bookmark.findByPk(id);
  if (bookmark) {
    return bookmark.toJSON();
  }
}

async function create(bookmark) {
  return (await Bookmark.create(bookmark)).toJSON();
}

async function update(id, bookmark) {
  const bookmarkObj = await Bookmark.findByPk(id);
  if (bookmarkObj) {
    return (await bookmarkObj.update(bookmark)).toJSON();
  }
  return bookmark;
}

async function del(id) {
  const count = await Bookmark.destroy({
    where: {
      id,
    },
  });
  return count === 1;
}

module.exports = {
  getAll,
  get,
  create,
  update,
  delete: del,
};

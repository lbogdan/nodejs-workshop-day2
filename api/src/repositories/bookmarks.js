const kv = require('./kv');
const Joi = require('joi');

const key = 'bookmarks';

const schema = Joi.object({
  url: Joi.string()
    .required()
    .uri({
      scheme: ['http', 'https'],
    }),
  title: Joi.string().required(),
});

function validate(bookmark) {
  const res = schema.validate(bookmark, {
    abortEarly: false,
  });
  if (res.error) {
    throw res.error;
  }
}

async function getAll() {
  return (await kv.get(key)) || [];
}

async function get(id) {
  return (await getAll()).find((bookmark) => bookmark.id === id);
}

async function create(bookmark) {
  validate(bookmark);
  const bookmarks = await getAll();
  const id = (await kv.get(`${key}.id`)) || 1;
  bookmark.id = id;
  const now = new Date().toISOString();
  bookmark.created_at = bookmark.updated_at = now;
  bookmarks.push(bookmark);
  kv.set(key, bookmarks);
  kv.set(`${key}.id`, id + 1);
  return bookmark;
}

async function update(id, bookmark) {
  validate(bookmark);
  const bookmarks = await getAll();
  const index = bookmarks.findIndex((bookmark) => bookmark.id === id);
  if (index === -1) {
    return;
  }
  bookmark.id = id;
  bookmark.updated_at = new Date().toISOString();
  bookmarks[index] = bookmark;
  await kv.set(key, bookmarks);
  return bookmark;
}

async function del(id) {
  const bookmarks = await getAll();
  const index = bookmarks.findIndex((bookmark) => bookmark.id === id);
  if (index === -1) {
    return;
  }
  bookmarks.splice(index, 1);
  await kv.set(key, bookmarks);
  return true;
}

module.exports = {
  getAll,
  get,
  create,
  update,
  delete: del,
};

const express = require('express');
// const bookmarks = require('../repositories/bookmarks');
const bookmarks = require('../repositories-sequelize/bookmarks');
const ah = require('express-async-handler');

const router = express.Router();

router.get(
  '/',
  ah(async (req, res) => {
    res.json(await bookmarks.getAll());
  })
);

function sendNotFound(res) {
  res.sendStatus(404);
}

router.get(
  '/:id',
  ah(async (req, res) => {
    const id = parseInt(req.params.id);
    const bookmark = await bookmarks.get(id);
    if (bookmark) {
      return res.json(bookmark);
    }
    sendNotFound(res);
  })
);

router.post(
  '',
  ah(async (req, res) => {
    const bookmark = await bookmarks.create(req.body);
    res.json(bookmark);
  })
);

router.put(
  '/:id',
  ah(async (req, res) => {
    const id = parseInt(req.params.id);
    const bookmark = await bookmarks.update(id, req.body);
    if (bookmark) {
      return res.send(bookmark);
    }
    res.sendStatus(404);
    // throw NotFoundError();
  })
);

router.delete(
  '/:id',
  ah(async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await bookmarks.delete(id);
    if (deleted) {
      return res.sendStatus(204);
    }
    res.sendStatus(404);
  })
);

module.exports = router;

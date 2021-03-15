const express = require('express');
const ah = require('express-async-handler');
const morgan = require('morgan');
const bookmarks = require('./repositories/bookmarks');

const app = express();

const port = 8080;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

function globalErrorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof NotFoundError) {
    return res.sendStatus(404);
  }

  console.log(err);
  res.status(500);
  res.json({
    error: err.message,
    stack: err.stack.split('\n'),
  });
}

app.use(express.json());
app.use(morgan('dev'));

app.get(
  '/api/v1/bookmarks',
  ah(async (req, res) => {
    res.json(await bookmarks.getAll());
  })
);

function sendNotFound(res) {
  res.sendStatus(404);
}

app.get(
  '/api/v1/bookmarks/:id',
  ah(async (req, res) => {
    const id = parseInt(req.params.id);
    const bookmark = await bookmarks.get(id);
    if (bookmark) {
      return res.json(bookmark);
    }
    sendNotFound(res);
  })
);

app.post(
  '/api/v1/bookmarks',
  ah(async (req, res) => {
    const bookmark = await bookmarks.create(req.body);
    res.json(bookmark);
  })
);

app.put(
  '/api/v1/bookmarks/:id',
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

app.delete(
  '/api/v1/bookmarks/:id',
  ah(async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await bookmarks.delete(id);
    if (deleted) {
      return res.sendStatus(204);
    }
    res.sendStatus(404);
  })
);

app.use(globalErrorHandler);

app.listen(port, '0.0.0.0', () => {
  console.log(`API listening on http://localhost:${port} ...`);
});

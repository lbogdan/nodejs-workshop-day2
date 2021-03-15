const express = require('express');
const ah = require('express-async-handler');

const app = express();

const port = 8080;

const bookmarks = [
  {
    id: 1,
    url: 'https://google.com/',
    title: 'Google',
  },
];

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

  res.status(500);
  res.json({
    error: err.message,
    stack: err.stack.split('\n'),
  });
}

app.use(express.json());

app.get(
  '/api/v1/bookmarks',
  ah(async (req, res) => {
    // throw new Error('Database error');
    res.json(bookmarks);
  })
);

function sendNotFound(res) {
  res.sendStatus(404);
}

app.get('/api/v1/bookmarks/:id', (req, res) => {
  const bookmark = bookmarks.find((b) => b.id === parseInt(req.params.id));
  if (bookmark) {
    return res.json(bookmark);
  }
  sendNotFound(res);
});

app.post('/api/v1/bookmarks', (req, res) => {
  const newId = bookmarks[bookmarks.length - 1].id + 1;
  const bookmark = req.body;
  bookmark.id = newId;
  bookmarks.push(bookmark);
  res.json(bookmark);
});

app.put('/api/v1/bookmarks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const bookmark = req.body;
  bookmark.id = id;
  const index = bookmarks.findIndex((b) => b.id === id);
  if (index !== -1) {
    // bookmarks.splice(index, 1, bookmark);
    bookmarks[index] = bookmark;
    return res.json(bookmark);
  }
  res.sendStatus(404);
  // throw NotFoundError();
});

app.delete('/api/v1/bookmarks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = bookmarks.findIndex((b) => b.id === id);
  if (index !== -1) {
    bookmarks.splice(index, 1);
    return res.sendStatus(204);
  }
  res.sendStatus(404);
});

app.use(globalErrorHandler);

app.listen(port, '0.0.0.0', () => {
  console.log(`API listening on http://localhost:${port} ...`);
});

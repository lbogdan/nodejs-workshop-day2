const express = require('express');
// const ah = require('express-async-handler');
const morgan = require('morgan');
const bookmarks = require('./routes/bookmarks');

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

app.use('/api/v1/bookmarks', bookmarks);

app.use(globalErrorHandler);

app.listen(port, '0.0.0.0', () => {
  console.log(`API listening on http://localhost:${port} ...`);
});

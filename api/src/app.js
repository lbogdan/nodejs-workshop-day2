const express = require('express');
const ah = require('express-async-handler');
const morgan = require('morgan');
const bookmarks = require('./routes/bookmarks');
const Joi = require('joi');
const users = require('./repositories/users');
const cookieSession = require('cookie-session');
const jwtMiddleware = require('express-jwt');
const jwt = require('jsonwebtoken');

const app = express();

const JWT_SECRET = 'someverysecretstring';

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

  if (Joi.isError(err)) {
    res.status(400);
    return res.json({
      error: err.message,
      details: err.details,
    });
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
app.use(
  cookieSession({
    secret: 'somesecretstring',
  })
);
app.use(
  jwtMiddleware({
    secret: JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false,
  })
);

app.use(
  '/api/v1/bookmarks',
  // (req, res, next) => {
  //   if (!req.session.user) {
  //     return res.sendStatus(401);
  //   }
  //   next();
  // },
  bookmarks
);

app.post(
  '/api/v1/auth/login',
  ah(async (req, res) => {
    const { username, password } = req.body;
    const user = await users.login(username, password);
    if (user) {
      req.session.user = { id: user.id };
      return res.json(user);
    }
    res.sendStatus(401);
  })
);

app.get(
  '/api/v1/auth/me',
  ah(async (req, res) => {
    if (req.session.user) {
      const user = await users.get(req.session.user.id);
      return res.json(user);
    }
    res.sendStatus(401);
  })
);

app.post(
  '/api/v1/auth/logout',
  ah(async (req, res) => {
    if (req.session.user) {
      req.session = null;
      return res.sendStatus(204);
    }
    res.sendStatus(401);
  })
);

app.post(
  '/api/v1/jwt/login',
  ah(async (req, res) => {
    const { username, password } = req.body;
    const user = await users.login(username, password);
    if (user) {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
          sub: user.id,
        },
        JWT_SECRET,
        { algorithm: 'HS256' }
      );
      res.json({
        ...user,
        token,
      });
    }
    res.sendStatus(401);
  })
);

app.get(
  '/api/v1/jwt/me',
  ah(async (req, res) => {
    if (req.user) {
      const user = await users.get(req.user.sub);
      return res.json(user);
    }
    res.sendStatus(401);
  })
);

app.use(globalErrorHandler);

module.exports = app;

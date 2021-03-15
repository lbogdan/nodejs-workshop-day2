## HTTP, http Module

- https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview#http_flow

```js
// index.js
const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.end('{"status":"ok"}');
});

server.listen(8000, '0.0.0.0', () => {
  console.log('listening on http://localhost:8000/ ...');
});
```

## Exercise 9 (Day 1)

```sh
Write a simple http server that serves files from a folder.
Use fs.stat() to check if the file exists and set the Content-Length header,
and a MIME package to properly set the Content-Type response header.
You have sample static files in the day 1 repo:
https://github.com/lbogdan/nodejs-workshop/tree/main/src/exercise9
```

## CRUD API - HTTP Methods

- GET /resource - get all resources (R)
  - filtering
  - sorting
  - pagination
- GET /resource/:id - get one resource (R)
- POST /resource - create resource (C)
- PUT /resource/:id - update resource (U)
- PATCH /resource/:id - partially update resource (U)
- DELETE /resource/:id - delete resource (D)

## HTTP Response Status Codes

- 200 OK
- 301 Moved Permanently
- 302 Found
- 304 Not Modifier
- 400 Bad Request - validation error
- 401 Unauthorized - not authenticated
- 403 Forbidden - not authorized
- 404 Not Found
- 500 Internal Server Error

## Content Negociation

- request format: `Content-Type` header
  - `application/json`
  - `application/x-www-form-urlencoded`
  - `multipart/form-data`
- accepted response format: `Accept` header

## Express

- Node.js web / API framework

```js
const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('hello, express!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
```

## Express Middleware

- chain of functions that process the request and / or the response
- called in the order they are `use()`d

```js
function someMiddleware(req, res, next) {
  // do stuff with req and / or res
  if (someCondition) {
    // end request
    res.sendStatus(500);
  } else {
    // call next middlewares in the chain
    next();
  }
}

// use it globally
app.use(someMiddleware);

// or use it for a specific request
app.get('/', someMiddleware, (req, res) => {
  res.send('OK');
});
```

## Request Logging

```sh
npm install morgan
```

```js
const morgan = require('morgan');

// ...

app.use(morgan('dev'));
```

## Restarting On Code Changes

```sh
npm install --save-dev nodemon
```

- define a `package.json` script:
```json
{
  "scripts": {
    "dev": "nodemon --delay 1 --watch src src/index.js"
  }
}
```

## Async Handlers

```sh
npm install express-async-handler
```

```js
const ah = require('express-async-handler');

// ...

app.get('/api/v1/bookmarks', ah(async (req, res) => {
  const bookmarks = await bookmarks.getAll();
  res.json(bookmarks);
}));
```

## Error Handlers

```js
function errorHandler(err, req, res, next) {
  // if headers already sent, let express handle it
  if (res.headersSent) {
    return next(err);
  }

  res.status(500);
  res.json({ error: err.message });
}

// should be last middleware added!
app.use(errorHandler);
```

## Body Parser

- `body-parser` package, deprecated since express 4.16.0

```js
app.use(express.json());
```

- also `raw()`, `urlencoded()`

- [documentation](https://expressjs.com/en/4x/api.html#express.json)

## Exercise 1

```sh
Implement a simple bookmarks API with the following endpoints:

GET /api/v1/bookmarks - get all bookmarks
GET /api/v1/bookmarks/:id - get bookmark by id
POST /api/v1/bookmarks - create bookmark
PUT /api/v1/bookmarks/:id - update bookmark
DELETE /api/v1/bookmarks/:id - delete bookmark

A bookmark should have an id, an url and a title.
Keep the data in memory for now.
```

## Repository Pattern

```js
const bookmarks = require('./repositories/bookmarks');

app.get('/api/v1/bookmarks', (req, res) => {
  res.json(bookmarks.getAll());
});
```

## Exercise 2

```sh
Exercise 2: Refactor exercise 1 to use the bookmarks repository from 'src/repositories'.
```

## Express Routes

```js
var router = express.Router();

router.get('/', (req, res) => { /* ... */ });

app.use('/api/v1/bookmarks', router);
```

## Testing With Jest

```sh
npm install jest
```

- add `test` script in `package.json`

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

## Jest (cont.)

```js
// add.js
module.exports = function add(a, b) {
  return a + b;
}

// add.spec.js
const add = require('./add');

describe('add', () => {
  it('adds numbers', () => {
    expect(add(1, 2)).toEqual(3);
  });
});
```

## Jest & Express - supertest

```sh
npm install supertest
```

```js
// bookmarks.spec.js
const app = require('./app');
const supertest = require('supertest');
const request = supertest(app);

describe('bookmarks', () => {
  it('get all', async (done) => {
    const res = await request.get('/api/v1/bookmarks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
    done();
  });
});
```

## Exercise 3

```sh
Test a few API endpoints.
```

## Validation

```sh
npm install joi
```

```js
const Joi = require('joi');

const schema = Joi.object({
  url: Joi.string()
    .required()
    .uri({
      scheme: ['http', 'https'],
    }),
  title: Joi.string().required(),
});

const res = schema.validate(bookmark);

if (res.error) {
  throw error;
}
```

## Exercise 4

```sh
Add simple validation to the bookmarks repository.
```

## Authentication - Cookies

```sh
npm install cookie-session
```

```js
const cookieSession = require('cookie-session');

app.use(cookieSession({
  secret: 'somethingsecret',
}));
```

- [documentation](https://expressjs.com/en/resources/middleware/cookie-session.html)


## Authentication - Cookies (cont.)

```js
app.get('/login', (req, res) => {
  const user = await doLogin(req.body.username, req.body.password);
  // start session
  req.session.user = { id: user.id };
});

app.get('/resource', (req, res) => {
  // check session
  if (!req.session.user) {
    return res.sendStatus(401);
  }
  // do authenticated stuff
});

app.get('/logout', (req, res) => {
  // destroy session
  req.session = null;
});
```

- [express-session](https://www.npmjs.com/package/express-session)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js#with-promises)

## Exercise 5

```sh
Add an authentication layer using cookie-session.
Use the users repository.
Use bcrypt to store passwords.

POST /api/v1/auth/login - login
GET /api/v1/auth/me - get logged in user
POST /api/v1/auth/logout - logout
```

## Authentication - JWTs

- [JSON Web Tokens](https://jwt.io/)

```sh
npm install jsonwebtoken express-jwt
```

```js
const jwtMiddleware = require('express-jwt');

// ...

app.use(jwtMiddleware({
  secret: 'somethingsecret',
  algorithms: ['HS256'],
  credentialsRequired: false,
}));
```

## Authentication - JWTs (cont.)

```js
const jwt = require('jsonwebtoken');

// ...

app.get('/login', (req, res) => {
  const user = await doLogin(req.body.username, req.body.password);
  const token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    sub: user.id,
  },
  'somethingsecret',
  { algorithm: 'HS256' });
  res.send({ token });
});
```

## Authentication - JWTs (cont.)

```js

app.get('/resource', (req, res) => {
  // check authentication
  if (!req.user) {
    res.sendStatus(401);
  }
  // do authenticated stuff
});
```

## Exercise 5

```sh
Add an JWT authentication layer.
```

## Data Persistence - Sequelize

```sh
npm install sequelize sqlite3
```

```js
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'data.sqlite',
  logging: console.log,
});

const Bookmark = sequelize.define(
  'Bookmark',
  {
    url: DataTypes.STRING,
    title: DataTypes.STRING,
  },
  {
    tableName: 'bookmarks',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
```

## Sequelize (cont.)

```js
const bookmark = Bookmark.findByPk(id);

console.log(bookmark.toJSON());

bookmark.update({ url: '...', title: '...' });

const bookmarks = Bookmark.findAll();

const count = Bookmark.destroy({
  where: {
    id: 1,
  },
});
```

## Exercise 6

```sh
Refactor repositories using Sequelize with a SQLite database.
Models are already defined in `src/repositories-sequelize/sequelize.js`.
```

## Uploading Files

```sh
npm install multer
```

```js
const multer = require('multer');

const upload = multer({
  dest: 'uploads',
});

app.post('/upload', upload.single('file'), (req, res) => {
  // file properties are in req.file
});
```

- [documentation](https://expressjs.com/en/resources/middleware/multer.html)

## Exercise 7

```sh
Write a simple web application that allows you to upload a file and then access it.
```

## Real-time Apps - socket.io

```sh
npm install socket.io
```

```js
const socket = require('socket.io');

const server = app.listen(/* ... */);

const io = socket(server);

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    // do stuff with message
  });

  socket.emit('message', 'hello!');
});
```

## socket.io Client

```html
<script src="/socket.io/socket.io.js"></script>
<script>
const socket = new io();

// will autoconnect by default
socket.on('connect', () => { /* ... */ });

socket.on('message', (message) => {
  console.log('got message:', message);
});
</script>
```

## Exercise 8

```sh
Write a simple socket.io chat application. It should allow a user to:
- connect to the chat server with a name
- send messages
- show messages sent by the other users
- show whenever a user joins or leaves the chat
```

## Q & A

## Feedback

- [feedback form](https://forms.gle/6sveR9pVBP71aSks8)

## Thank You!

##

const express = require('express');

const app = express();

const port = 8080;

const bookmarks = [
  {
    id: 1,
    url: 'https://google.com/',
    title: 'Google',
  },
];

app.get('/api/v1/bookmarks', (req, res) => {
  res.json(bookmarks);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`API listening on http://localhost:${port} ...`);
});

const express = require('express');
const path = require('path');

const port = 8080;

const app = express();

app.use(express.static(path.join(path.dirname(__dirname), 'static')));

app.post('/upload', async (req, res) => {
  // implement
  res.send('OK');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`upload app listening on http://localhost:${port}/ ...`);
});

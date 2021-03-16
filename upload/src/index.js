const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs').promises;

const upload = multer({
  dest: 'uploads',
});

const port = 8080;

const app = express();

app.use(express.static(path.join(path.dirname(__dirname), 'static')));

app.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    console.log('upload, file:', req.file);
    await fs.copyFile(req.file.path, `static/uploads/${req.file.originalname}`);
    await fs.unlink(req.file.path);
    res.send(`file uploaded to /uploads/${req.file.originalname}`);
  } catch (err) {
    next(err);
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`upload app listening on http://localhost:${port}/ ...`);
});

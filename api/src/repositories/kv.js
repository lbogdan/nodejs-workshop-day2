const fs = require('fs').promises;
const path = require('path');

const dataFile = path.join(path.dirname(path.dirname(__dirname)), 'data.json');
let data;

async function readFile() {
  if (process.env.NODE_ENV === 'test') {
    return {};
  }
  try {
    return JSON.parse(await fs.readFile(dataFile, 'utf8'));
  } catch (err) {
    return {};
  }
}

function writeFile(data) {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  return fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

async function get(key) {
  if (data === undefined) {
    data = await readFile();
  }
  return data[key];
}

async function set(key, value) {
  data[key] = value;
  await writeFile(data);
}

module.exports = {
  get,
  set,
};

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use(cors());

const urlDatabase = {}; 

const generateShortURL = () => {
  const short = Math.random().toString(36).substring(7);
  return short;
};

app.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  const shortURL = generateShortURL();
  urlDatabase[shortURL] = {originalUrl, clicks:0};
  console.log(urlDatabase);
  res.json({ shortURL: `${process.env.BASE_URL}/${shortURL}` });
});

app.get(`/:shortURL`, async (req, res) => {
  const shortURL = req.params.shortURL;
  const urlData = urlDatabase[shortURL];
  if (urlData) {
    urlData.clicks+=1;
    res.redirect(urlData.originalUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

app.get('/analytics/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const urlData = urlDatabase[shortURL];
  if (urlData) {
    res.json({ originalUrl: urlData.originalUrl, clicks: urlData.clicks });
  } else {
    res.status(404).send('URL not found');
  }
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

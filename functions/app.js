const _ = require('lodash');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

const app = express();

app.use(bodyParser.json());

app.get('/test', (req, res) => {
  res.send(`Testing from firebase cloud functions. ${Date.now()}`);
});

app.get('/timestamp-cached', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.send(`${Date.now()}`);
});

app.use(authRoutes);
app.use(deviceRoutes);

// app.use(express.static('build'));
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
});

module.exports = app;

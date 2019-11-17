const _ = require('lodash');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const logRoutes = require('./routes/logRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const apiRoutes = require('./routes/api');

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
app.use(logRoutes);
app.use(feedbackRoutes);
app.use(apiRoutes);

// app.use(express.static(__dirname + '../client/build/index.html'));
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
});

module.exports = app;

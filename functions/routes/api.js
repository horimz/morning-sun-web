const _ = require('lodash');
const express = require('express');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const { firestore } = require('../firebase/firebase-admin');

const router = new express.Router();

// Generate jwt for a client
router.get('/api/msun/generateAccessToken', async (req, res) => {
  const query = req.query;

  let apiKey = query.apiKey || false;
  let deviceId = query.deviceId || false;

  if (!apiKey || !deviceId) return res.sendStatus(403);

  var _uid = undefined;
  var _deviceDocumentId = undefined;
  var userEmail;

  try {
    // Validate API key
    const apiKeys = await firestore.collection('keys').get();
    apiKeys.forEach(doc => {
      const key = doc.data();
      if (key.apiKey === apiKey) _uid = key.uid;
    });

    if (_uid === undefined) return res.json({ error: 'Invalid Api key.' });

    // Find owner of the given API key
    const userDoc = await firestore.doc(`users/${_uid}`).get();
    const user = userDoc.data();

    // Validate Device ID
    const devices = await firestore.collection(`users/${_uid}/devices/`).get();
    devices.forEach(doc => {
      const device = doc.data();
      if (device.id === deviceId) _deviceDocumentId = doc.id;
    });

    if (_deviceDocumentId === undefined)
      return res.json({ error: 'Device not found.' });

    // Generate jwt based on uid with secret
    const accessToken = jwt.sign(user, keys.accessTokenSecret, {
      algorithm: 'HS256'
    });

    res.json({ accessToken, user, _deviceDocumentId });
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
});

// Publish messages
router.post('/api/msun/publish', authenticateToken, async (req, res) => {
  // Assumes that the client side validate the data format
  const { uid } = req.user;
  const { config, values } = req.body;

  const { timeinmillis, today, now, deviceId } = config;
  const { voltage, current, power } = values;

  // format
  const data = {
    timeinmillis,
    voltage,
    current,
    power
  };

  // add
  await firestore
    .doc(`users/${uid}/devices/${deviceId}/${today}/${now}`)
    .set(data);

  res.json(data);
});

// Publish logs
router.post('/api/msun/log', authenticateToken, async (req, res) => {
  const { uid } = req.user;
  const { date, level, deviceId, message } = req.body;

  const log = {
    date,
    deviceId,
    level,
    message
  };

  await firestore.collection(`users/${uid}/logs`).add(log);

  res.json(log);
});

// middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, keys.accessTokenSecret, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

module.exports = router;

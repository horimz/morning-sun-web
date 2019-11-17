const _ = require('lodash');
const express = require('express');
const moment = require('moment');
const jwt = require('jsonwebtoken');
// const keys = require('../config/keys');
const authenticateToken = require('../middlewares/authenticateToken');
const { firestore } = require('../firebase/firebase-admin');

const router = new express.Router();

// Publish data
router.post('/api/publish', authenticateToken, async (req, res) => {
  // publish data
});

async function publishFakeData(uid) {
  deviceId = 'C9eSuD1gBGe0HXEOTBjQ';

  var [today, time] = moment()
    .format()
    .split('T');

  var now = time.split('+')[0];

  // format
  const data = {
    date: new Date().toString(),
    voltage: parseFloat((Math.random() * 10).toFixed(2)),
    current: parseFloat((Math.random() * 10).toFixed(2)),
    power: parseFloat((Math.random() * 10).toFixed(2))
  };

  console.log(data);

  // add
  const docRef = firestore.doc(
    `users/${uid}/devices/${deviceId}/2019-11-17/${now}`
  );

  await docRef.set(data);
  console.log('Published!');
}

// setInterval(() => {
//   publishFakeData('g0ceEfYhubXmxSPhvuLNy9KKG0G2');
// }, 1500);

// var start = new Date('2019-10-20').toString();
// var end = new Date('2019-10-25').toString();

// const diffTime = Math.abs(new Date(end) - new Date(start));
// const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// console.log(diffDays);
const t = new Date().toString();
console.log(t);
module.exports = router;

const express = require('express');
const router = new express.Router();
const { firestore } = require('../firebase/firebase-admin');

router.post('/api/login', async (req, res) => {
  const user = req.body;

  const userDocRef = await firestore.doc(`users/${user.uid}`);
  const userDoc = await userDocRef.get();

  if (!userDoc.exists) {
    await userDocRef.set(user);
    console.log('Successfuly added a new user to firestore!');
  }

  res.send({});
});

router.get('/api/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/api/current_user', (req, res) => {
  res.send(req.user);
});

module.exports = router;

const express = require('express');
const uuidAPIKey = require('uuid-apikey');
const authenticateToken = require('../middlewares/authenticateToken');
const { firestore } = require('../firebase/firebase-admin');

const router = new express.Router();

router.post('/api/login', async (req, res) => {
  const user = req.body;
  const userDocRef = firestore.doc(`users/${user.uid}`);
  const userDoc = await userDocRef.get();

  if (!userDoc.exists) {
    user['purchased'] = false;
    await userDocRef.set(user);
    console.log('Successfuly added a new user to firestore!');
  }

  console.log(`${userDoc.data().displayName} signed in!`);

  res.send({});
});

router.get('/api/current_user', authenticateToken, (req, res) => {
  res.send(req.user);
});

const keyPrefix = 'm-sun-';

router.get('/api/generateKey', authenticateToken, async (req, res) => {
  const { uid, apiKey } = req.user;

  const keysCollectionRef = firestore.collection('keys');

  // Generate an key based on uid
  try {
    const apiKeyExists = apiKey || false;
    const { uuid } = uuidAPIKey.create();
    const key = (keyPrefix + uuidAPIKey.toAPIKey(uuid)).toLowerCase();

    if (apiKeyExists) {
      // Udpate existing key
      var existingKeyDocId;
      const keys = await keysCollectionRef.get();

      keys.forEach(doc => {
        const key = doc.data();
        if (key.uid === uid) existingKeyDocId = doc.id;
      });

      await keysCollectionRef
        .doc(existingKeyDocId)
        .set({ apiKey: key }, { merge: true });
    } else {
      await keysCollectionRef.add({ uid, apiKey: key });
    }

    await firestore.doc(`users/${uid}`).set({ apiKey: key }, { merge: true });

    // Fetch updated user
    const updatedUserDoc = await firestore.doc(`users/${uid}`).get();
    const updatedUser = updatedUserDoc.data();

    res.send(updatedUser);
  } catch (err) {
    console.log('Error getting documents.', err);
    return res.status(500).send();
  }
});

module.exports = router;

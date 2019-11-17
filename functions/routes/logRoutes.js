const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const { firestore } = require('../firebase/firebase-admin');

const router = new express.Router();

// authenticateToken middleware stores the user information in the request (req.user = user)
router.get('/api/logs', authenticateToken, async (req, res) => {
  try {
    const logs = await fetchLogs(req.user.uid);
    if (!logs) throw new Error('Failed to fetch logs.');
    res.send(logs);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.post('/api/logs', authenticateToken, async (req, res) => {
  const { ids } = req.body;
  const logsCollectionRef = firestore.collection(`users/${req.user.uid}/logs`);

  try {
    // Delete logs
    for (var i = 0; i < ids.length; i++) {
      await logsCollectionRef.doc(ids[i]).delete();
    }

    // Fetch logs
    const logs = await fetchLogs(req.user.uid);
    if (!logs) throw new Error('Failed to fetch logs.');
    res.send(logs);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

async function fetchLogs(uid) {
  const logs = [];

  try {
    const logsCollection = await firestore
      .collection(`users/${uid}/logs`)
      .get();

    logsCollection.forEach(doc => {
      const log = {
        _id: doc.id,
        data: doc.data()
      };

      logs.push(log);
    });
  } catch (error) {
    console.log(error);
    return false;
  }

  return logs;
}

module.exports = router;

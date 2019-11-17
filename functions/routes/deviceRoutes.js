const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const { firestore } = require('../firebase/firebase-admin');

const router = new express.Router();

// authenticateToken middleware stores the user information in the request (req.user = user)
router.get('/api/device', authenticateToken, async (req, res) => {
  const { id } = req.query;
  const { uid } = req.user;
  const result = {
    deviceInformation: [],
    numOfLogs: { critical: 0, error: 0, warning: 0, info: 0 },
    logs: []
  };

  // Fetch device information
  const deviceDocRef = firestore.doc(`users/${uid}/devices/${id}`);
  const deviceDoc = await deviceDocRef.get();
  const devicdId = deviceDoc.data().id;

  const subCollections = await deviceDocRef.listCollections();

  const subCollectionIds = [];
  subCollections.forEach(collection => {
    subCollectionIds.push(collection.id);
  });

  for (var i = 0; i < subCollectionIds.length; i++) {
    const subCollectionId = subCollectionIds[i];
    let numOfDataPublished = 0;

    const subCollection = await deviceDocRef.collection(subCollectionId).get();

    subCollection.forEach(doc => {
      numOfDataPublished += 1;
      // find last data published time
    });

    result.deviceInformation.push({
      date: subCollectionId,
      value: numOfDataPublished
    });
  }

  // Fetch logs created from this device
  const logs = await firestore.collection(`users/${uid}/logs`).get();

  // for (let i = 0; i < logs.length; i++)
  logs.forEach(doc => {
    const log = doc.data();

    if (log.deviceId === devicdId) {
      result.logs.push(log);

      switch (log.level) {
        case 'critical':
          result.numOfLogs.critical += 1;
          break;
        case 'error':
          result.numOfLogs.error += 1;
          break;
        case 'warning':
          result.numOfLogs.warning += 1;
          break;
        case 'info':
          result.numOfLogs.info += 1;
          break;
        default:
          console.warning('Undefined log level');
          break;
      }
    }
  });

  res.json(result);
});

router.get('/api/devices', authenticateToken, async (req, res) => {
  try {
    const devices = await fetchDevices(req.user.uid);
    if (!devices) throw new Error('Failed to fetch devices.');
    res.send(devices);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.post('/api/addDevice', authenticateToken, async (req, res) => {
  const { id, date } = req.body;

  try {
    // Add new device
    await firestore
      .collection(`users/${req.user.uid}/devices`)
      .add({ id, date });

    // Fetch devices
    const devices = await fetchDevices(req.user.uid);
    if (!devices) throw new Error('Failed to fetch devices.');
    res.send(devices);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.delete('/api/device', authenticateToken, async (req, res) => {
  const { _id, id } = req.query;
  const { uid } = req.user;

  try {
    // Delete device
    await firestore.doc(`users/${uid}/devices/${_id}`).delete();

    // Delete logs created from this device
    const documentIdsOflogsToDelete = [];
    const logs = await firestore.collection(`users/${uid}/logs`).get();

    logs.forEach(doc => {
      const log = doc.data();
      if (log.deviceId === id) documentIdsOflogsToDelete.push(doc.id);
    });

    for (let i = 0; i < documentIdsOflogsToDelete.length; i++) {
      await firestore
        .doc(`users/${uid}/logs/${documentIdsOflogsToDelete[i]}`)
        .delete();
    }

    // Fetch devices
    const devices = await fetchDevices(req.user.uid);
    if (!devices) throw new Error('Failed to fetch devices.');
    res.send(devices);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

async function fetchDevices(uid) {
  const devices = [];

  try {
    const devicesCollections = await firestore
      .collection(`users/${uid}/devices`)
      .get();

    devicesCollections.forEach(doc => {
      const { id, date } = doc.data();

      const device = {
        _id: doc.id,
        id,
        date
      };

      devices.push(device);
    });
  } catch (error) {
    console.log(error);
    return false;
  }

  return devices;
}

module.exports = router;

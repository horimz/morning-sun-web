const express = require('express');
const router = new express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { firestore } = require('../firebase/firebase-admin');

// authenticateToken middleware stores the user information in the request (req.user = user)
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
  const { id } = req.body;

  try {
    // Add new device
    await firestore.collection(`users/${req.user.uid}/devices`).add({ id });

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
      const device = {
        _id: doc.id,
        id: doc.data().id
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

const express = require('express');
const router = new express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { firestore } = require('../firebase/firebase-admin');

// authenticateToken middleware stores the user information in the request (req.user = user)
router.get('/api/feedbacks', authenticateToken, async (req, res) => {
  // TODO: return feedbacks to admin page
});

router.post('/api/feedback', authenticateToken, async (req, res) => {
  const { type, message } = req.body;

  const feedback = {
    type,
    message,
    from: req.user.email
  };

  const feedbacksCollectionRef = firestore.collection('feedbacks');

  try {
    await feedbacksCollectionRef.add(feedback);

    res.send({});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;

const { admin, firestore } = require('../firebase/firebase-admin');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const idToken = authHeader && authHeader.split(' ')[1];

  if (idToken == null) return res.sendStatus(401);

  try {
    // Verify id token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Get user document
    const userDoc = await firestore.doc(`users/${uid}`).get();
    const user = userDoc.data();

    // Set user in request
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

module.exports = authenticateToken;

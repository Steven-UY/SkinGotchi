const admin = require('firebase-admin');

// Middleware to verify ID token
async function verifyToken(req, res, next) {
    const token = req.cookies.token;
    console.log('Token from cookie:', token); // Debugging line

    if (!token) {
        console.error('No token provided');
        return res.status(403).json({ success: false, error: 'No Token Provided' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log('Decoded token:', decodedToken); // Debugging line
        req.uid = decodedToken.uid;
        next();
    } catch (error) {
        console.error('Error verifying token: ', error);
        res.status(401).json({ success: false, error: 'Invalid Token' });
    }
}

module.exports = verifyToken;

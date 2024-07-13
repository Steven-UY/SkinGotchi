const admin = require('firebase-admin');

//Middleware to verify ID token
async function verifyToken(req, res, next){
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return res.status(403).json({ success: false, error: 'No token provided' });
    }

    const token = authorizationHeader.split(`Bearer `)[1];
    if (!token){
        return res.status(403).json({ success: false, error: 'Malformed Token' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.uid = decodedToken.uid;
        next();
    } catch(error) {
        console.error('Error verifying token: ', error);
        res.status(401).json({ success: false, error: 'Invalid Token'});
    }
}

module.exports = verifyToken;  
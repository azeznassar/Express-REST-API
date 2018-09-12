const jwt = require('jsonwebtoken');

module.exports = (req, resp, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT);
        req.userData = decodedToken;
        next();
    } catch (error) {
        return resp.status(401).json({ message: 'Authentication failed' });
    }
};
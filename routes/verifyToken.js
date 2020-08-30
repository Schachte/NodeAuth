const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        const { issued } = verified

        // Token expires every 30 seconds
        if (issued + 30 < Math.round(new Date().getTime() / 1000)) {
            return res.status(400).send('Token Expired');
        }
        next()
    } catch (err) {
        return res.status(400).send('Invalid Token');
    }
}
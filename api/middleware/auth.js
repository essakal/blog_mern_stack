const jwt = require("jsonwebtoken");
require("dotenv").config()

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401);
    else{
        JWT_SECRET = process.env.KEY
        jwt.verify(token, JWT_SECRET, (err, userData) => {
        if (err)
            return res.sendStatus(403);
        else {
            req.user = userData;
            next();
        }
    })
    }
}

module.exports = authenticateToken;
const jwt = require('jsonwebtoken');

//token secret and expiry
const secret = 'mysecretsshhhhh';
const expiration = '2h';

//authentication function
module.exports = {
    authMiddleware: function ({ req }) {
        let token = req.query.token || req.headers.authorization;

        if (req.headers.authorization) {
            token = token.split(' ').pop().trim();
        }

        if (!token) {
            return req
        }

        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch {
            console.error('Invalid token')
        }
        return req
    },
    signToken: function ({ username, email, _id }) {
        const payload = { username, email, _id }
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration })
    }
}
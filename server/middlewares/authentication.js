const { raw } = require("express");
const { verifyToken } = require("../helpers/jwt");


module.exports = async function authMiddleware(req, res, next) {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            throw { name: 'Unauthorized', message: 'Please login first' };
        }

        const rawToken = authorization.split(' ')
        const tokenType = rawToken[0];
        const tokenValue = rawToken[1];

        if (tokenType !== 'Bearer' || !tokenValue) {
            throw { name: 'Unauthorized', message: 'Invalid Token' };
        }

        const payload = verifyToken(tokenValue);

        const user = await User.findByPk(payload.id);
        if (!user) {
            throw { name: 'Unauthorized', message: 'Invalid Token' };
        }

        req.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        next();
    } catch (error) {
        next(error)
    }
}
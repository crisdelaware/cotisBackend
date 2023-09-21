const jwt = require('jsonwebtoken');
const configJwt = require('../config/configJwt');

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return sendUnauthorized(res, 'Acceso denegado, token no proporcionado');
    }

    try {
        const decoded = jwt.verify(token, configJwt.jwtSecret);
        req.user = decoded.user;

        // Agrega un registro de depuración aquí para verificar los datos del usuario
        console.log('Datos del usuario:', req.user);

        next();
    } catch (error) {
        return sendUnauthorized(res, 'Token no válido');
    }
};

function sendUnauthorized(res, message) {
    return res.status(401).json({ message });
}

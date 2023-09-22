function isAdmin(req, res, next) {
    if(req.user && req.user.role === 'admin') {
    // El usuario es un admin, permite el acceso
    next();
    } else {
    // El usuario no tiene permisos para esta accion
    res.status(403).json({ message: 'Acceso denegado' });
    }
}

module.exports = isAdmin;
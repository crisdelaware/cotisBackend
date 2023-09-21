const express = require('express');
const userController = require('../controllers/userControllers');

const router = express.Router();

// Ruta para crear nuevo usuario
router.post('/create', userController.createUser);

// Otras rutas de usuario (actualizar, eliminar, obtener, etc.)

module.exports = router;
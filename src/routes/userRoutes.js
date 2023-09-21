const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas protegidas por JWT
router.get('/profile', authMiddleware, userController.getProfile);

// Ruta para crear nuevo usuario
router.post('/create', userController.createUser);

// Ruta para eliminar la cuenta (solo para usuarios autenticados)
router.delete('/delete', authMiddleware, userController.deleteAccount);

// Otras rutas de usuario (actualizar, eliminar, obtener, etc.)

module.exports = router;
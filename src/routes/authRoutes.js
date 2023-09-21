const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para autenticar al usuario y generar un token JWT
router.post('/login', authController.login);



module.exports = router;
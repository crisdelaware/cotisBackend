const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const configJwt = require('../config/configJwt');
const User = require('../models/user');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar al usuario por correo electrónico
        const user = await User.findOne({ email });

        // Verificar si el usuario no existe
        if (!user) {
            return res.status(401).json({
                message: 'Correo electrónico no encontrado'
            });
        }

        // Verificar la contraseña
        const passwordMatch = await bcrypt.compare(password, user.password);

        // Si la contraseña no coincide
        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Contraseña incorrecta'
            });
        }

        // Crear un token JWT
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                role: user.role
            },
        };

        const token = jwt.sign(payload, configJwt.jwtSecret, { expiresIn: configJwt.jwtExpiresIn });

        // Redirigir segun el rol del usuario
        if(user.role === 'admin') {
            res.json({ token });
        } else {
        // Usuario normal, redirigir a la ruta de usuario normal
        res.json({ token })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error en el servidor'
        });
    }
}

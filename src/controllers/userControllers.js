const User = require('../models/user');
const bcrypt = require('bcrypt');

async function createUser(req, res) {
    try {
        const { username, email, fullName, shippingAddress, phoneNumber, password } = req.body;

        // Validaciones
        if(!username || !email || !fullName || !shippingAddress || !phoneNumber || !password) {
            return res.status(400).json({
                error: 'Todos los campos son obligatorios'
            })
        };

        // Verificar si el correo electronico ya existe en una base de datos
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({
                error: 'El correo electronico ya esta registrado'
            });
        }

        // Validar el formato del correo electronico (puedes utilizar expresiones regulares)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Formato de correo no valido'
            });
        }

        // Validar longitud minima de la contraseña
        if(password.length < 8) {
            return res.status(400).json({
                error: 'La contraseña debe tener al menos 8 caracteres'
            });
        }

        // Cifrar la contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear el usuario con la contraseña cifrada
        const newUser = new User({
             username, email, fullName, shippingAddress, phoneNumber, password: hashedPassword 
            });

        await newUser.save();
        
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
}

async function getProfile(req, res) {
    try {
        // Aqui obten la informacion del usuario autenticado desde req.user
        const user = req.user;

        // Agrega registros de depuración para verificar los datos del usuario
        console.log('Datos del usuario en getProfile:', user);

        // Puedes personalizar esta parte para devolver la informacion especifica del perfil que necesitas
        const userProfile = {
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            shippingAddress: user.shippingAddress,
            phoneNumber: user.phoneNumber,
            // Otras propiedades de perfil que puedas tener
        };
        res.json({ userProfile });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al obtener el perfil del usuario'
        });
    }

}

module.exports = {
    createUser,
    getProfile
    // Otras funciones de controlador de usuario (actualizar, eliminar, obtener, etc.)
};
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Funcion para crear el usuario
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
             username, email, fullName, shippingAddress, phoneNumber, password: hashedPassword,
            });

        await newUser.save();
        
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
}

// Funcion para obtener el perfil
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
            role: user.role,
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


// Función para obtener el perfil de un administrador
async function getAdminProfile(req, res) {
    try {
        const user = req.user; // Obtiene la información del usuario autenticado desde req.user

        // Puedes personalizar esta parte para devolver información específica del perfil del administrador
        const adminProfile = {
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            // Otras propiedades específicas del perfil de administrador
        };

        res.json({ adminProfile });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al obtener el perfil del administrador'
        });
    }
}

// Funcion para eliminar cuenta
async function deleteAccount(req, res) {
    try {
        const userId = req.user.id;
        const userEmail = req.user.email;
        // Buscar y eliminar el usuario por su ID
        const deletedUser = await User.findByIdAndRemove(userId);

        if(!deletedUser) {
            return res.status(400).json({
                message: 'Usuario no encontrado'
            });
        }

        res.json({ message: `Cuenta eliminada con exito ${userEmail}` });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al eliminar la cuenta'
        });
    }
}

module.exports = {
    createUser,
    getProfile,
    deleteAccount,
    getAdminProfile
    // Otras funciones de controlador de usuario (actualizar, eliminar, obtener, etc.)
};
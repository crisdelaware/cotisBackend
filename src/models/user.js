const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    shippingAddress: String,
    phoneNumber: String,
    password: {
        type: String,
        required: true,
        minlength: 8, // Por ejemplo, requerir al menos 8 caracteres
    },
    // Puede ser 'admin' o 'usuario'
    role: {
        type: String,
        default: 'usuario' // Valor predetermiado
    },
    resetToken: String, // almacenar el token de restablecimiento de contraseña
    resetTokenExpires: Date, // Fecha de expiracion del token de restablecimiento
});

const User = mongoose.model('User', userSchema);

module.exports = User;

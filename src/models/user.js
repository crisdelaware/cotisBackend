const moongose = require('mongoose');

const userSchema = new moongose.Schema({
    username: String,
    email: String,
    fullName: String,
    shippingAddress: String,
    phoneNumer: String,
    password: String

    // Otros campos de usuario
});

const User = moongose.model('User', userSchema);

module.exports = User;
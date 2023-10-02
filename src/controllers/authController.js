const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const configJwt = require('../config/configJwt');
const User = require('../models/user');
const nodemailer = require('nodemailer');

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


// Función para enviar correos electrónicos
async function sendEmail(recipient, subject, htmlContent) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'crisdelaware@gmail.com',
            pass: 'ysma cphr cyes very'
        },
        secure: true,
    });

    const mailOptions = {
        to: recipient,
        subject,
        html: htmlContent,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
}

// Controlador para la recuperación de contraseña
async function forgotPassword(req, res) {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'Correo electrónico no encontrado'
            });
        }

        const token = jwt.sign({ userId: user._id }, configJwt.jwtSecret, { expiresIn: '1h' });

        user.resetToken = token;
        user.resetTokenExpires = Date.now() + 3600000;
        await user.save();

        const resetPasswordLink = `http://localhost:3000/reset-password/${token}`;
        const emailSubject = 'Restablecimiento de contraseña';
        const emailContent = `Para restablecer tu contraseña, haz clic en el siguiente enlace <a href="${resetPasswordLink}">${resetPasswordLink}</a>`;

        await sendEmail(email, emailSubject, emailContent);

        res.json({
            message: 'Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico'
        });
    } catch (error) {
        console.error('Error en forgotPassword:', error);
        res.status(500).json({
            message: 'Error en el servidor'
        });
    }
}

// Controlador para el restablecimiento de la contraseña
async function resetPassword(req, res) {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(401).json({
                message: 'Token no válido o expirado'
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);
        user.password = hashedPassword;

        user.resetToken = undefined;
        user.resetTokenExpires = undefined;

        await user.save();

        res.json({
            message: 'Contraseña restablecida con éxito'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error en el servidor'
        });
    }
}

exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
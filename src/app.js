// En app.js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

// Importar configuración de la base de datos
require('./config/database'); // Asegúrate de que este sea el nombre correcto de tu archivo de configuración de la base de datos

// Rutas de usuario
app.use('/users', userRoutes);

// Rutas de autenticación
app.use('/auth', authRoutes);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});

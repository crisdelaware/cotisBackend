// En app.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());

// Configuración de CORS
const corsOptions = {
    origin: 'http://localhost:4200', // Cambia esto al dominio de tu aplicación Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Habilita el intercambio de cookies o encabezados de autenticación
    optionsSuccessStatus: 204, // Algunas solicitudes CORS envían una solicitud de opciones antes de la solicitud real (preflight), esto indica que está bien.
  };

  app.use(cors(corsOptions));

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

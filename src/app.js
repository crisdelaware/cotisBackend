const express = require('express');
const userRoutes = require('./routes/userRoutes');

// Importar y ejecutar el archivo de configuración de la base de datos
require('./config/database');

const app = express();
const port = 3000; // Puedes cambiar el puerto si lo deseas

app.use(express.json());

// Rutas de usuario
app.use('/users', userRoutes);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});


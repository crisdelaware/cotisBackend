const mongoose = require('mongoose');

// URL de conexion a la base de datos MongoDB
const dbUrl = 'mongodb+srv://crisdelaware:1708428b056@cluster0.aocrpq3.mongodb.net/?retryWrites=true&w=majority';


mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Opciones adicionales según sea necesario
  })
    .then(() => {
      console.log('Conexión a MongoDB exitosa.');
    })
    .catch((error) => {
      console.error('Error de conexión a MongoDB:', error);
    });

// Manejador de eventos para la conexion
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexion a MongoDB:'));
db.once('open', () => {
    console.log('Conexion a MongoDB exitosaa');
});
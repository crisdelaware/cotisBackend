require('dotenv').config();
const mongoose = require('mongoose');

const dbUrl = 'mongodb+srv://crisdelaware:1708428b056@cluster0.aocrpq3.mongodb.net/comercioElectronico?retryWrites=true&w=majority';


// Resto del código de conexión...
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Conexión a MongoDB exitosa.');
})
.catch((error) => {
    console.error('Error de conexión a MongoDB:', error);
    process.exit(1); // Salir de la aplicación en caso de error grave
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Conexión a MongoDB cerrada debido a la terminación de la aplicación');
        process.exit(0);
    });
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexion a MongoDB:'));
db.once('open', () => {
    console.log('Conexion a MongoDB exitosaa');
});

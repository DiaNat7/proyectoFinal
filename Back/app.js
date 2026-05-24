const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares globales 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enlazando las rutas
app.use('/auth', require('./src/routes/auth.routes'));
app.use('/categorias', require('./src/routes/categorias.routes'));
app.use('/favoritos', require('./src/routes/favoritos.routes'));
app.use('/ofertas', require('./src/routes/ofertas.routes'));
app.use('/tiendas', require('./src/routes/tiendas.routes'));

// Manejo de errores
app.use(require('./src/middlewares/errorHandler'));

// Configuración de Base de Datos
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ofertasya';

console.log('Intentando conectar a:', MONGO_URI);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('🟢 Conectado exitosamente a la base de datos:', mongoose.connection.db.databaseName);
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor backend corriendo en http://0.0.0.0:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('🔴 Error crítico conectando a la base de datos:', error.message);
  });
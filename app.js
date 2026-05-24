// app.js (ahora en la raíz)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// Ahora los paths llevan src/
app.use('/api/auth',       require('./Back/src/routes/auth.routes'));
app.use('/api/categorias', require('./Back/src/routes/categorias.routes'));
app.use('/api/tiendas',    require('./Back/src/routes/tiendas.routes'));
app.use('/api/ofertas',    require('./Back/src/routes/ofertas.routes'));
app.use('/api/favoritos',  require('./Back/src/routes/favoritos.routes'));

app.use(require('./Back/src/middlewares/errorHandler'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conexión exitosa a MongoDB'))
  .catch(err => console.error('❌ Error de conexión:', err));

app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor en puerto ${process.env.PORT}`);
});
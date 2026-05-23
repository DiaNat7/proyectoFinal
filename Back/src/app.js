// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth',       require('./routes/auth.routes'));
app.use('/api/categorias', require('./routes/categorias.routes'));
app.use('/api/tiendas',    require('./routes/tiendas.routes'));
app.use('/api/ofertas',    require('./routes/ofertas.routes'));
app.use('/api/favoritos',  require('./routes/favoritos.routes'));

app.use(require('./middlewares/errorHandler'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conexión exitosa a MongoDB'))
  .catch(err => console.error('❌ Error de conexión:', err));

app.listen(process.env.PORT, () => console.log('🚀 Servidor en puerto ' + process.env.PORT));

module.exports = app;
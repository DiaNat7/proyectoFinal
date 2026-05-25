
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth',       require('./Back/src/routes/auth.routes'));
app.use('/categorias', require('./Back/src/routes/categorias.routes'));
app.use('/tiendas',    require('./Back/src/routes/tiendas.routes'));
app.use('/ofertas',    require('./Back/src/routes/ofertas.routes'));
app.use('/favoritos',  require('./Back/src/routes/favoritos.routes'));

app.use(require('./Back/src/middlewares/errorHandler'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conexión exitosa a MongoDB'))
  .catch(err => console.error('❌ Error de conexión:', err));

// AGREGAMOS '0.0.0.0' PARA QUE EL EMULADOR PUEDA ENTRAR
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor en http://0.0.0.0:${PORT}`);
});
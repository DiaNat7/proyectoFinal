const mongoose = require('mongoose')
const FavoritoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  oferta:  { type: mongoose.Schema.Types.ObjectId, ref: 'Oferta', required: true }
}, { timestamps: true });
module.exports = mongoose.model('Favorito', FavoritoSchema);
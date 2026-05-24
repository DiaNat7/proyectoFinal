const mongoose = require('mongoose')
const OfertaSchema = new mongoose.Schema({
  titulo:          { type: String, required: true },
  descripcion:     String,
  precioAnterior:  { type: Number, required: true },
  precioActual:    { type: Number, required: true },
  imagen:          String,
  fechaExpiracion: Date,
  tienda: { type: mongoose.Schema.Types.ObjectId, ref: 'Tienda' }
}, { timestamps: true });
module.exports = mongoose.model('Oferta', OfertaSchema);

const TiendaSchema = new mongoose.Schema({
  nombre:    { type: String, required: true },
  ubicacion: String,
  logo:      String,
  contacto:  String,
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' }
});
module.exports = mongoose.model('Tienda', TiendaSchema);

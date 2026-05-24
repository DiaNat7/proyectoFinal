const Favorito = require('../models/Favorito');

module.exports = {
  getMine: (userId)           => Favorito.find({ usuario: userId }).populate('oferta'),
  add:     (userId, ofertaId) => Favorito.create({ usuario: userId, oferta: ofertaId }),
  remove:  (id)               => Favorito.findByIdAndDelete(id)
};
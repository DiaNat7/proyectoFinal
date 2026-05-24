const Favorito = require('../models/Favorito');

module.exports = {
  getMine: (userId)          => Favorito.find({ usuario: userId }).populate('oferta'),
  add:     (userId, ofertaId) => Favorito.create({ usuario: userId, oferta: ofertaId }),
<<<<<<< HEAD
=======
  
>>>>>>> 8ddd17803310174674f5852475bb7a989d88c446
  remove:  (id)              => Favorito.findByIdAndDelete(id)
};
const Oferta = require('../models/Oferta');

<<<<<<< HEAD
module.exports = {
  getAll:  ()         => Oferta.find().populate({ path: 'tienda', populate: { path: 'categoria' } }),
=======

module.exports = {
  getAll:  ()         => Oferta.find().populate({ path: 'tienda', populate: { path: 'categoria' } }),
  
>>>>>>> 8ddd17803310174674f5852475bb7a989d88c446
  getById: (id)       => Oferta.findById(id).populate('tienda'),
  create:  (data)     => Oferta.create(data),
  update:  (id, data) => Oferta.findByIdAndUpdate(id, data, { new: true }),
  remove:  (id)       => Oferta.findByIdAndDelete(id)
};
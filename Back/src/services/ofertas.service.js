const Oferta = require('../models/Oferta');

module.exports = {
  getAll:  ()         => Oferta.find().populate({ path: 'tienda', populate: { path: 'categoria' } }),
  getById: (id)       => Oferta.findById(id).populate('tienda'),
  create:  (data)     => Oferta.create(data),
  update:  (id, data) => Oferta.findByIdAndUpdate(id, data, { new: true }),
  remove:  (id)       => Oferta.findByIdAndDelete(id)
};
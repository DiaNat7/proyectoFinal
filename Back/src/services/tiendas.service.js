const Tienda = require('../models/Tienda');

module.exports = {
  getAll:  ()         => Tienda.find().populate('categoria'),
  getById: (id)       => Tienda.findById(id).populate('categoria'),
  create:  (data)     => Tienda.create(data),
  update:  (id, data) => Tienda.findByIdAndUpdate(id, data, { new: true }),
  remove:  (id)       => Tienda.findByIdAndDelete(id)
  
};
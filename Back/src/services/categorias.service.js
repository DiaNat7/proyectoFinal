const Categoria = require('../models/Categoria');

module.exports = {
  getAll:  ()           => Categoria.find(),
  getById: (id)         => Categoria.findById(id),
  create:  (data)       => Categoria.create(data),
  update:  (id, data)   => Categoria.findByIdAndUpdate(id, data, { new: true }),
  
  remove:  (id)         => Categoria.findByIdAndDelete(id)
};
const Categoria = require('../models/Categoria');

module.exports = {
  getAll:  ()           => Categoria.find(),
  getById: (id)         => Categoria.findById(id),
  create:  (data)       => Categoria.create(data),
  update:  (id, data)   => Categoria.findByIdAndUpdate(id, data, { new: true }),
<<<<<<< HEAD
=======
  
>>>>>>> 8ddd17803310174674f5852475bb7a989d88c446
  remove:  (id)         => Categoria.findByIdAndDelete(id)
};
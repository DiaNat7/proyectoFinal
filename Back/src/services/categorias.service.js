const Categoria = require('../models/Categoria');

module.exports = {
  getAll: async () => {
    return await Categoria.find();
  },

  getById: async (id) => {
    const categoria = await Categoria.findById(id);
    if (!categoria) throw { status: 404, message: 'Categoría no encontrada' };
    return categoria;
  },

  create: async (data) => {
    // Validación 
    if (!data.nombre) {
      throw { status: 400, message: 'El nombre de la categoría es obligatorio' };
    }
    return await Categoria.create(data);
  },

  update: async (id, data) => {
    // Validación de existencia antes de actualizar
    const categoriaActualizada = await Categoria.findByIdAndUpdate(id, data, { new: true });
    if (!categoriaActualizada) {
      throw { status: 404, message: 'No se puede actualizar: Categoría no encontrada' };
    }
    return categoriaActualizada;
  },

  remove: async (id) => {
    // Validación de existencia antes de eliminar
    const categoriaEliminada = await Categoria.findByIdAndDelete(id);
    if (!categoriaEliminada) {
      throw { status: 404, message: 'No se puede eliminar: Categoría no encontrada' };
    }
    return categoriaEliminada;
  }
};
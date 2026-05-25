const Tienda = require('../models/Tienda');

module.exports = {
  getAll: async () => {
    return await Tienda.find().populate('categoria');
  },

  getById: async (id) => {
    const tienda = await Tienda.findById(id).populate('categoria');
    // Validación: Si no existe, lanzamos error 404
    if (!tienda) throw { status: 404, message: 'Tienda no encontrada' };
    return tienda;
  },

  create: async (data) => {
    // Validación
    if (!data.nombre) {
      throw { status: 400, message: 'El nombre de la tienda es obligatorio' };
    }
    return await Tienda.create(data);
  },

  update: async (id, data) => {
    // Validación de existencia antes de actualizar
    const tiendaActualizada = await Tienda.findByIdAndUpdate(id, data, { new: true });
    if (!tiendaActualizada) {
      throw { status: 404, message: 'No se puede actualizar: Tienda no encontrada' };
    }
    return tiendaActualizada;
  },

  remove: async (id) => {
    // Validación de existencia antes de eliminar
    const tiendaEliminada = await Tienda.findByIdAndDelete(id);
    if (!tiendaEliminada) {
      throw { status: 404, message: 'No se puede eliminar: Tienda no encontrada' };
    }
    return tiendaEliminada;
  }
};
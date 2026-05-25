const Oferta = require('../models/Oferta');

module.exports = {
  getAll: async () => {
    return await Oferta.find().populate({ path: 'tienda', populate: { path: 'categoria' } });
  },

  getById: async (id) => {
    const oferta = await Oferta.findById(id).populate('tienda');
    if (!oferta) throw { status: 404, message: 'Oferta no encontrada' };
    return oferta;
  },

  create: async (data) => {
    // Validación
    if (!data.titulo || !data.precioActual) {
      throw { status: 400, message: 'El título y el precio actual son obligatorios' };
    }
    return await Oferta.create(data);
  },

  update: async (id, data) => {
    // Validamos que exista antes de intentar actualizar
    const ofertaActualizada = await Oferta.findByIdAndUpdate(id, data, { new: true });
    if (!ofertaActualizada) {
      throw { status: 404, message: 'No se puede actualizar: Oferta no encontrada' };
    }
    return ofertaActualizada;
  },

  remove: async (id) => {
    // Validamos que exista antes de borrar
    const ofertaEliminada = await Oferta.findByIdAndDelete(id);
    if (!ofertaEliminada) {
      throw { status: 404, message: 'No se puede eliminar: Oferta no encontrada' };
    }
    return ofertaEliminada;
  }
};
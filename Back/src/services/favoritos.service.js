const Favorito = require('../models/Favorito');

module.exports = {
  getMine: async (userId) => {
    if (!userId) throw { status: 400, message: 'ID de usuario requerido' };
    return await Favorito.find({ usuario: userId }).populate('oferta');
  },

  add: async (userId, ofertaId) => {
    // Validación 
    if (!userId || !ofertaId) {
      throw { status: 400, message: 'Datos incompletos para agregar favorito' };
    }

    //  Evitar duplicados
    const yaExiste = await Favorito.findOne({ usuario: userId, oferta: ofertaId });
    if (yaExiste) {
      throw { status: 409, message: 'Esta oferta ya está en tus favoritos' };
    }

    return await Favorito.create({ usuario: userId, oferta: ofertaId });
  },

  remove: async (id) => {
    //  Manejo de errores
    const favoritoEliminado = await Favorito.findByIdAndDelete(id);
    if (!favoritoEliminado) {
      throw { status: 404, message: 'Favorito no encontrado' };
    }
    return favoritoEliminado;
  }
};
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  register: async ({ nombre, email, password, rol }) => {
    const existe = await User.findOne({ email });
    if (existe) throw { status: 400, message: 'Email ya registrado' };
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ nombre, email, password: hash, rol });
    return { message: 'Usuario creado', userId: user._id };
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw { status: 401, message: 'Credenciales inválidas' };
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw { status: 401, message: 'Credenciales inválidas' };
    const token = jwt.sign(
      { id: user._id, rol: user.rol }, // ← incluir rol en el token
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    return { token, user: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol } };
  }
};
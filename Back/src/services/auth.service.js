const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  register: async ({ nombre, email, password }) => {
    const existe = await User.findOne({ email });
    if (existe) throw { status: 400, message: 'Email ya registrado' };
    
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ nombre, email, password: hash });
    
    return { message: 'Usuario creado', userId: user._id };
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw { status: 401, message: 'Credenciales inválidas' };
    
    console.log("Password enviado:", password);
    console.log("Hash en DB:", user.password);
    
    const ok = await bcrypt.compare(password, user.password);
    
    console.log("¿La contraseña coincide?:", ok); 
  

    if (!ok) throw { status: 401, message: 'Credenciales inválidas' };
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { token, user: { id: user._id, nombre: user.nombre, email: user.email } };
  }
};
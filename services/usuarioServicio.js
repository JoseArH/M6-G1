const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");

const obtenerTodosLosUsuarios = async () => {
  return await Usuario.findAll();
};

const obtenerUsuarioPorId = async (id) => {
  return await Usuario.findByPk(id);
};

const crearUsuario = async (userData) => {
  try {
    if (!userData.contrasena || userData.contrasena.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    const usuario = await Usuario.create(userData);
    return usuario;
  } catch (error) {
    console.error('Error en usuarioServicio.crearUsuario:', error);
    throw error;
  }
};

const crearComprador = async (datos) => {
  const { contrasena, email, ...restDatos } = datos;

  const usuarioExistente = await Usuario.findOne({ where: { email } });

  if (usuarioExistente) {
    throw new Error("El usuario ya existe.");
  }

  let hashedPass = await bcrypt.hash(contrasena, 10);

  const userData = {
    ...restDatos,
    email,
    contrasena: hashedPass,
    rol: 'comprador',
  };

  return await Usuario.create(userData);
};

const actualizarUsuario = async (id, datos) => {
  const usuario = await Usuario.findByPk(id);
  if (usuario) {
    return await usuario.update(datos);
  }
  return null;
};

const eliminarUsuario = async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (usuario) {
    return await usuario.destroy();
  }
  return null;
};

module.exports = {
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  crearComprador,
  actualizarUsuario,
  eliminarUsuario,
};

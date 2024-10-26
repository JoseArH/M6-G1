const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");

const obtenerTodosLosUsuarios = async () => {
  return await Usuario.findAll();
};

const obtenerUsuarioPorId = async (id) => {
  return await Usuario.findByPk(id);
};

const crearUsuario = async (datos) => {
  const { contrasena, ...restDatos } = datos;

  let hashedPass = await bcrypt.hash(contrasena, 10);

  const userData = {
    ...restDatos,
    contrasena: hashedPass,
  };

  return await Usuario.create(userData);
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

const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

const obtenerTodosLosUsuarios = async () => {
  return await Usuario.findAll();
};

const obtenerUsuarioPorId = async (id) => {
  return await Usuario.findByPk(id);
};

const crearUsuario = async (datos) => {
    try {
        // Verificar si el usuario ya existe
        const existente = await Usuario.findOne({ where: { correo: datos.correo } });
        if (existente) {
            throw new Error('El correo ya está registrado');
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const contrasenaHash = await bcrypt.hash(datos.contrasena, salt);

        console.log('Contraseña original:', datos.contrasena);
        console.log('Contraseña hasheada:', contrasenaHash);

        // Crear usuario
        return await Usuario.create({
            ...datos,
            contrasena: contrasenaHash
        });
  } catch (error) {
        console.error('Error al crear usuario:', error);
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

const autenticarUsuario = async (correo, contrasena) => {
    try {
        console.log('Intentando autenticar usuario:', correo);
        const usuario = await Usuario.findOne({ where: { correo } });
        
        if (!usuario) {
            console.log('Usuario no encontrado');
            return null;
        }

        console.log('Usuario encontrado:', usuario.correo);
        console.log('Hash almacenado:', usuario.contrasena);
        
        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
        console.log('Contraseña proporcionada:', contrasena);
        console.log('Contraseña válida:', contrasenaValida);
        
        if (!contrasenaValida) {
            return null;
        }

        return usuario;
    } catch (error) {
        console.error('Error en autenticación:', error);
        throw error;
    }
};

const buscarPorCorreo = async (correo) => {
    try {
        return await Usuario.findOne({ where: { correo } });
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        throw error;
    }
};

module.exports = {
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  crearComprador,
  actualizarUsuario,
  eliminarUsuario,
  autenticarUsuario,
  buscarPorCorreo
};
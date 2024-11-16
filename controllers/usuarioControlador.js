const usuarioServicio = require("../services/usuarioServicio");
const Usuario = require("../models/Usuario");

const obtenerUsuarios = async (req, res) => {
    const usuarios = await usuarioServicio.obtenerTodosLosUsuarios();
    res.render("usuarios/index", { usuarios });
};

const obtenerUsuario = async (req, res) => {
    const usuario = await usuarioServicio.obtenerUsuarioPorId(req.params.id);
    res.render("usuarios/detalle", { usuario });
};

const crearUsuario = async (req, res) => {
    try {
        const { nombre, apellido, correo, contrasena } = req.body;
        await usuarioServicio.crearUsuario({
            nombre,
            apellido,
            correo,
            contrasena,
            rol: 'admin' 
        });
        res.redirect("/usuarios");
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).render('usuarios/index', {
            usuarios: await usuarioServicio.obtenerTodosLosUsuarios(),
            error: 'Error al crear el usuario'
        });
    }
};

const crearComprador = async (req, res) => {
    try {
        if (!req.body) {
            throw new Error('No se recibieron datos del formulario');
        }

        console.log('Datos del formulario:', req.body);
        
        const { nombre, apellido, correo, contrasena } = req.body;
        
        if (!nombre || !apellido || !correo || !contrasena) {
            throw new Error('Todos los campos son requeridos');
        }

        const nuevoUsuario = await usuarioServicio.crearUsuario({
            nombre,
            apellido,
            correo,
            contrasena,
            rol: 'comprador'
        });

        console.log('Usuario creado:', nuevoUsuario);
        res.render('auth/registro-exitoso', {
            mensaje: '¡Usuario creado exitosamente!',
            nombre: nombre
        });
    } catch (error) {
        console.error('Error detallado:', error);
        
        let mensajeError = 'Error al crear el usuario';
        if (error.name === 'SequelizeUniqueConstraintError') {
            mensajeError = 'El correo electrónico ya está registrado';
        } else if (error.message) {
            mensajeError = error.message;
        }

        res.status(500).render('auth/registro', {
            titulo: 'Registro',
            error: mensajeError,
            valores: req.body ? {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                correo: req.body.correo
            } : {}
        });
    }
};

const actualizarUsuario = async (req, res) => {
    await usuarioServicio.actualizarUsuario(req.params.id, req.body);
    res.redirect("/usuarios");
};

const eliminarUsuario = async (req, res) => {
    await usuarioServicio.eliminarUsuario(req.params.id);
    res.redirect("/usuarios");
};

const mostrarFormularioEditarUsuario = async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
        return res.status(404).send('Usuario no encontrado');
    }
    res.render('usuarios/editarUsuario', { usuario });
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    mostrarFormularioEditarUsuario,
    crearComprador
};



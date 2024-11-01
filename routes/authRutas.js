const express = require('express');
const router = express.Router();
const usuarioControlador = require('../controllers/usuarioControlador');

router.get('/login', (req, res) => {
    res.render('auth/login', { titulo: 'Login' });
});

router.get('/registro', (req, res) => {
    res.render('auth/registro', { titulo: 'Registro' });
});

router.post('/registro', (req, res, next) => {
    console.log('Datos del formulario:', req.body);
    next();
}, usuarioControlador.crearComprador);

module.exports = router;

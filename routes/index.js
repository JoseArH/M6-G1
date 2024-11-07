const express = require('express');
const router = express.Router();
const authRutas = require('./authRutas');
const productoRutas = require('./productoRutas');
const categoriaRutas = require('./categoriasRutas');
const { esAutenticado } = require('../middlewares/auth');

// Ruta principal
router.get('/', (req, res) => {
    res.render('index', { titulo: 'Inicio' });
});

// Rutas de autenticación
router.use('/auth', authRutas);

// Rutas de productos (algunas requieren autenticación)
router.use('/productos', productoRutas);

// Rutas de categorías (requieren autenticación)
router.use('/categorias', esAutenticado, categoriaRutas);

module.exports = router;

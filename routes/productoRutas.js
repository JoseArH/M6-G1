// routes/productoRutas.js
const express = require('express');
const router = express.Router();
const productoControlador = require('../controllers/productoControlador');
const { esAutenticado, esAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Rutas públicas
router.get('/shop', productoControlador.mostrarTienda);
router.get('/', esAutenticado, productoControlador.listarProductos); // Requiere autenticación
// Rutas protegidas para admin
router.get('/json', esAdmin, productoControlador.obtenerProductosJson);
router.post('/busqueda', esAdmin, productoControlador.buscarPorNombre);
router.get('/:id', esAdmin, productoControlador.obtenerProducto);
router.get('/:id/editar', esAdmin, productoControlador.mostrarFormularioEditarProducto);
router.post('/', esAdmin, upload.single('imagen'), productoControlador.crearProducto);
router.post('/:id/actualizar', esAdmin, productoControlador.actualizarProducto);
router.post('/:id/eliminar', esAdmin, productoControlador.eliminarProducto);

module.exports = router;

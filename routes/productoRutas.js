const express = require('express');
const router = express.Router();
const productoControlador = require('../controllers/productoControlador');

router.get('/', productoControlador.obtenerProductos);
router.get('/:id', productoControlador.obtenerProducto);
router.post('/', productoControlador.crearProducto);
router.post('/:id/actualizar', productoControlador.actualizarProducto);
router.post('/:id/eliminar', productoControlador.eliminarProducto);
router.get('/:id/editar', productoControlador.mostrarFormularioEditarProducto);


module.exports = router;

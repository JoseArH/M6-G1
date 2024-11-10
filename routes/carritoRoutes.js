const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');
const { esAutenticado } = require('../middlewares/auth');

router.get('/', esAutenticado, carritoController.mostrarCarrito);
router.post('/agregar', esAutenticado, carritoController.agregarAlCarrito);
router.post('/eliminar/:id', esAutenticado, carritoController.eliminarDelCarrito);
router.post('/actualizar/:id', esAutenticado, carritoController.actualizarCantidad);

module.exports = router;

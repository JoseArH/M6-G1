const express = require('express');
const router = express.Router();
const categoriaControlador = require('../controllers/categoriaControlador');

router.get('/', categoriaControlador.obtenerCategorias);
router.post('/', categoriaControlador.crearCategoria);
router.get('/:id', categoriaControlador.obtenerCategoria);
router.post('/:id', categoriaControlador.eliminarCategoria);/* esto deberia ser delete pero method de html solo acepta get|post, refactorizar */
router.post("/:id/actualizar", categoriaControlador.actualizarCategoria);
router.get('/:id/editar', categoriaControlador.mostrarFormularioEditarCategoria);

module.exports = router;

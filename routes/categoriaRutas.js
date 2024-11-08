const express = require("express");
const router = express.Router();
const categoriaControlador = require("../controllers/categoriaControlador");
const { esAutenticado, esAdmin } = require("../middlewares/auth");

router.get("/", esAdmin, categoriaControlador.obtenerCategorias);
router.post("/", esAdmin, categoriaControlador.crearCategoria);
router.get("/:id", esAdmin, categoriaControlador.obtenerCategoria);
router.post("/:id", esAdmin, categoriaControlador.eliminarCategoria);
router.post(
  "/:id/actualizar",
  esAdmin,
  categoriaControlador.actualizarCategoria
);
router.get(
  "/:id/editar",
  esAdmin,
  categoriaControlador.mostrarFormularioEditarCategoria
);

module.exports = router;

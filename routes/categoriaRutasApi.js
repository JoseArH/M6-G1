const express = require("express");
const router = express.Router();
const categoriaControlador = require("../controllers/categoriaControlador");

router.get("/", categoriaControlador.obtenerCategoriasJson);
router.get("/:id", categoriaControlador.obtenerCategoriaJson);

module.exports = router;

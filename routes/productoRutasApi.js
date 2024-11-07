const express = require("express");
const router = express.Router();
const productoControlador = require("../controllers/productoControlador");

router.get(`/`, productoControlador.obtenerProductosJson);
router.get(`/:id`, productoControlador.obtenerProductoJson);

module.exports = router;

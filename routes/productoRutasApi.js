const express = require("express");
const router = express.Router();
const productoControlador = require("../controllers/productoControlador");
const { esAutenticado } = require("../middlewares/auth");

router.get(`/`, esAutenticado, productoControlador.obtenerProductosJson);
router.get(`/:id`, esAutenticado, productoControlador.obtenerProductoJson);

module.exports = router;

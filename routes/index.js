const express = require("express");
const router = express.Router();
const authRutas = require("./authRutas");
const productoRutas = require("./productoRutas");
const categoriaRutas = require("./categoriaRutas");
const { esAutenticado, esAdmin } = require("../middlewares/auth");
const productoControlador = require("../controllers/productoControlador");
const productoRutasApi = require("./productoRutasApi");
const categoriaRutasApi = require("./categoriaRutasApi");
const usuarioRutas = require("./usuarioRuta");

// Ruta principal
router.get("/", productoControlador.mostrarTienda);
router.get("/admin", esAdmin, (req, res) => {
  res.render("index", { titulo: "Admin" });
});
// Rutas de autenticación
router.use("/auth", authRutas);

// Rutas de productos (requieren autenticación)
router.use("/productos", productoRutas);
router.use("/api/productos", productoRutasApi);

// Rutas de categorías (requieren autenticación)
router.use("/categorias", esAutenticado, categoriaRutas);
router.use("/api/categorias", categoriaRutasApi);

router.use("/usuarios", usuarioRutas);

module.exports = router;

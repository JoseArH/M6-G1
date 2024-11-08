// routes/productoRutas.js
const express = require("express");
const router = express.Router();
const productoControlador = require("../controllers/productoControlador");
const { esAdmin , esAutenticado} = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// Rutas públicas
// router.get('/shop', productoControlador.mostrarTienda);
// Rutas protegidas para admin
router.get("/", esAdmin, productoControlador.listarProductos); // Requiere autenticación
router.post("/busqueda", esAdmin, productoControlador.buscarPorNombre);
router.get("/:id", esAdmin, productoControlador.obtenerProducto);
router.get(
  "/:id/editar",
  esAdmin,
  productoControlador.mostrarFormularioEditarProducto
);
router.post(
  "/",
  esAdmin,
  upload.single("imagen"),
  productoControlador.crearProducto
);
router.post("/:id/actualizar", esAdmin, productoControlador.actualizarProducto);
router.post("/:id/eliminar", esAdmin, productoControlador.eliminarProducto);

module.exports = router;

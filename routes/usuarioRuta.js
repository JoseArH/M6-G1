const express = require("express");
const router = express.Router();
const usuarioControlador = require("../controllers/usuarioControlador");
const { esAdmin } = require("../middlewares/auth");

router.get("/", esAdmin, usuarioControlador.obtenerUsuarios);
router.get("/:id", esAdmin, usuarioControlador.obtenerUsuario);
router.post("/", esAdmin, usuarioControlador.crearUsuario);
router.post("/:id/actualizar", esAdmin, usuarioControlador.actualizarUsuario);
router.post("/:id/delete", esAdmin, usuarioControlador.eliminarUsuario);
router.get(
  "/:id/editar",
  esAdmin,
  usuarioControlador.mostrarFormularioEditarUsuario
);

module.exports = router;

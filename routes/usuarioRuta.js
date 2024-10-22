const express = require("express");
const router = express.Router();
const usuarioControlador = require("../controllers/usuarioControlador"); 

router.get("/", usuarioControlador.obtenerUsuarios);
router.get("/:id", usuarioControlador.obtenerUsuario);
router.post("/", usuarioControlador.crearUsuario);
router.put("/:id", usuarioControlador.actualizarUsuario);
router.delete("/:id", usuarioControlador.eliminarUsuario);

module.exports = router;

const express = require("express");
const router = express.Router();
const controller = require("../controllers/webpay_plus"); // Correct import
const WebpayPlus = require("transbank-sdk").WebpayPlus;
const { esAutenticado } = require('../middlewares/auth');

// Configuración de Webpay (producción o pruebas)
router.use(function (req, res, next) {
  if (process.env.WPP_CC && process.env.WPP_KEY) {
    WebpayPlus.configureForProduction(process.env.WPP_CC, process.env.WPP_KEY);
  } else {
    WebpayPlus.configureForTesting();
  }
  next();
});

// Rutas para iniciar y confirmar la transacción
router.get("/init", esAutenticado, controller.create); // Use controller.create here
router.get("/commit", controller.commit); 
router.post("/commit", controller.commit);



module.exports = router;
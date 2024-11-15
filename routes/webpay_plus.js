const express = require("express");
const router = express.Router();
const controller = require("../controllers/webpay_plus");
const WebpayPlus = require("transbank-sdk").WebpayPlus;
const { esAutenticado } = require('../middlewares/auth');

router.use(function (req, res, next) {
  if (process.env.WPP_CC && process.env.WPP_KEY) {
    WebpayPlus.configureForProduction(process.env.WPP_CC, process.env.WPP_KEY);
  } else {
    WebpayPlus.configureForTesting();
  }
  next();
});

router.get("/init", esAutenticado, controller.create);
router.get("/commit", controller.commit); 
router.post("/commit", controller.commit);



module.exports = router;
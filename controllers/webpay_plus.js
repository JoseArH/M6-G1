const { WebpayPlus } = require("transbank-sdk");
const asyncHandler = require("../utils/asyncHandler");
const carritoServicio = require("../services/carritoServicio"); // Importa el servicio del carrito


exports.create = asyncHandler(async function (req, res) {
  if (!req.session.user) {
    return res.status(401).send("Usuario no autenticado");
  }

  const usuarioId = req.session.user.id;
  const carritos = await carritoServicio.obtenerCarritoPorUsuario(usuarioId);

  let total = 0;
  if (carritos && carritos.length > 0) {
    carritos.forEach(item => {
      if (item.Producto && item.Producto.precio) {
        total += item.Producto.precio * item.cantidad;
      }
    });
  }

  if (total === 0) {
    return res.status(400).send("El carrito está vacío");
  }
  
    let buyOrder = "OrdenDeCompra" + Date.now(); // Genera un buyOrder dinámico
    let sessionId = req.session.id; // Usa el ID de la sesión como sessionId
    let amount = total; // Usa el total del carrito como el monto
    let returnUrl = `${req.protocol}://${req.get("host")}/webpay_plus/commit`;

  const createResponse = await new WebpayPlus.Transaction().create(
    buyOrder,
    sessionId,
    amount,
    returnUrl
  );

  res.render("webpay_plus/create", {
    token: createResponse.token,
    url: createResponse.url,
    buyOrder,
    sessionId,
    amount,
  });
});

// Confirmar Transacción
exports.commit = asyncHandler(async function (req, res) {
  const token = req.query.token_ws || req.body.token_ws;

  if (!token) {
    return res.status(400).send("Token no recibido");
  }

  // Confirmar la transacción con el token recibido
  const commitResponse = await new WebpayPlus.Transaction().commit(token);
  res.render("webpay_plus/commit", {
    token,
    commitResponse,
  });
});

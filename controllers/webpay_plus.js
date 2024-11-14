const { WebpayPlus } = require("transbank-sdk");
const asyncHandler = require("../utils/asyncHandler");
const carritoServicio = require("../services/carritoServicio");
const productoServicio = require("../services/productoServicio");
const Carrito = require("../models/Carrito");

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
  
  let buyOrder = "OrdenDeCompra" + Date.now();
  let sessionId = req.session.id;
  let amount = total;
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

  if (commitResponse.status === 'AUTHORIZED') {
    // La transacción fue exitosa, actualizamos el inventario
    const usuarioId = req.session.user.id;
    const carritos = await carritoServicio.obtenerCarritoPorUsuario(usuarioId);

    for (const item of carritos) {
      try {
        await productoServicio.actualizarInventario(item.productoId, item.cantidad, 'restar');
      } catch (error) {
        console.error(`Error al actualizar inventario para producto ${item.productoId}:`, error);
        // Aquí podrías manejar el error, por ejemplo, revertir la transacción o notificar al administrador
      }
    }

    // Limpiamos el carrito del usuario
    await Carrito.update({ estado: 'comprado' }, {
      where: { usuarioId, estado: 'pendiente' }
    });
  }

  res.render("webpay_plus/commit", {
    token,
    commitResponse,
  });
});

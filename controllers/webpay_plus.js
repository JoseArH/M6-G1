const { WebpayPlus } = require("transbank-sdk");
const asyncHandler = require("../utils/asyncHandler");
const carritoServicio = require("../services/carritoServicio");
const productoServicio = require("../services/productoServicio");
const usuarioServicio = require("../services/usuarioServicio");
const { enviarCorreoConfirmacion } = require("../services/emailServicio");
const Carrito = require("../models/Carrito");

// Iniciar Transacción
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

    try {
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
    } catch (error) {
        console.error("Error al crear transacción:", error);
        res.status(500).send("Error al iniciar la transacción");
    }
});

// Confirmar Transacción
exports.commit = asyncHandler(async function (req, res) {
    const token = req.query.token_ws || req.body.token_ws;

    if (!token) {
        return res.status(400).send("Token no recibido");
    }

    try {
        // Confirmar la transacción con el token recibido
        const commitResponse = await new WebpayPlus.Transaction().commit(token);

        if (commitResponse.status === 'AUTHORIZED') {
            try {
                // La transacción fue exitosa, actualizamos el inventario
                const usuarioId = req.session.user.id;
                const carritos = await carritoServicio.obtenerCarritoPorUsuario(usuarioId);

                let detallesCompra = [];

                // Actualizar inventario y preparar detalles de compra
                for (const item of carritos) {
                    try {
                        await productoServicio.actualizarInventario(
                            item.productoId, 
                            item.cantidad, 
                            'restar'
                        );
                        detallesCompra.push({
                            producto: item.Producto.nombre,
                            cantidad: item.cantidad,
                            precio: item.Producto.precio
                        });
                    } catch (error) {
                        console.error(`Error al actualizar inventario para producto ${item.productoId}:`, error);
                        // Aquí podrías implementar un sistema de reversión de la transacción
                    }
                }

                // Actualizar estado del carrito
                await Carrito.update(
                    { estado: 'comprado' }, 
                    { where: { usuarioId, estado: 'pendiente' }}
                );

                // Obtener información del usuario y enviar correo
                const usuario = await usuarioServicio.obtenerUsuarioPorId(usuarioId);
                if (usuario) {
                    try {
                        await enviarCorreoConfirmacion(usuario.correo, {
                            orderNumber: commitResponse.buy_order,
                            total: commitResponse.amount,
                            detalles: detallesCompra
                        });
                        console.log('Correo de confirmación enviado a:', usuario.correo);
                    } catch (error) {
                        console.error('Error al enviar correo de confirmación:', error);
                        // El error en el envío del correo no debería afectar la transacción
                    }
                } else {
                    console.error('Usuario no encontrado para enviar correo de confirmación');
                }

            } catch (error) {
                console.error('Error al procesar la compra:', error);
                // Aquí podrías implementar un sistema de notificación al administrador
            }
        } else {
            console.log('Transacción no autorizada:', commitResponse.status);
        }

        // Renderizar la vista de resultado
        res.render("webpay_plus/commit", {
            token,
            commitResponse,
        });

    } catch (error) {
        console.error('Error al confirmar la transacción:', error);
        res.status(500).render("error", {
            message: "Error al procesar el pago",
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

const Carrito = require('../models/Carrito');
const Producto = require('../models/Producto');

const obtenerCarritoPorUsuario = async (usuarioId) => {
    return await Carrito.findAll({
        where: { usuarioId, estado: 'pendiente' },
        include: [{
            model: Producto,
            attributes: ['nombre', 'precio', 'imagen', 'inventario']
        }]
    });
};

const verificarInventario = async (productoId, cantidadSolicitada) => {
    const producto = await Producto.findByPk(productoId);
    if (!producto) {
        throw new Error('Producto no encontrado');
    }
    if (producto.inventario < cantidadSolicitada) {
        throw new Error(`Solo hay ${producto.inventario} unidades disponibles`);
    }
    return true;
};

const agregarAlCarrito = async (usuarioId, productoId, cantidad) => {
    // Verificar inventario antes de agregar
    await verificarInventario(productoId, cantidad);

    const itemExistente = await Carrito.findOne({
        where: { usuarioId, productoId, estado: 'pendiente' },
        include: [{ model: Producto }]
    });

    if (itemExistente) {
        const nuevaCantidad = itemExistente.cantidad + cantidad;
        // Verificar que la nueva cantidad no exceda el inventario
        await verificarInventario(productoId, nuevaCantidad);
        
        return await itemExistente.update({
            cantidad: nuevaCantidad
        });
    }

    return await Carrito.create({
        usuarioId,
        productoId,
        cantidad
    });
};

const actualizarCantidad = async (id, usuarioId, cantidad) => {
    const item = await Carrito.findOne({
        where: { id, usuarioId },
        include: [{ model: Producto }]
    });

    if (!item) {
        throw new Error('Item no encontrado en el carrito');
    }

    // Verificar inventario antes de actualizar
    await verificarInventario(item.productoId, cantidad);

    return await item.update({ cantidad });
};

const eliminarDelCarrito = async (id, usuarioId) => {
    return await Carrito.destroy({
        where: { id, usuarioId }
    });
};

// Añadir esta línea para mantener la compatibilidad con el código anterior
const obtenerCarrito = obtenerCarritoPorUsuario;

module.exports = {
    obtenerCarritoPorUsuario,
    obtenerCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    verificarInventario
};

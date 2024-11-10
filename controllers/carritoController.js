const carritoServicio = require('../services/carritoServicio');

const mostrarCarrito = async (req, res) => {
    try {
        const items = await carritoServicio.obtenerCarritoPorUsuario(req.session.user.id);
        const total = items.reduce((sum, item) => sum + (item.Producto.precio * item.cantidad), 0);
        res.render('carrito/index', { items, total });
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).render('error', { error: 'Error al obtener el carrito' });
    }
};

const agregarAlCarrito = async (req, res) => {
    try {
        const { productoId, cantidad } = req.body;
        await carritoServicio.agregarAlCarrito(req.session.user.id, productoId, parseInt(cantidad));
        res.redirect('/carrito');
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        // Redirigir con mensaje de error
        res.status(400).render('error', { error: error.message });
    }
};

const eliminarDelCarrito = async (req, res) => {
    try {
        await carritoServicio.eliminarDelCarrito(req.params.id, req.session.user.id);
        res.redirect('/carrito');
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        res.status(500).render('error', { error: 'Error al eliminar del carrito' });
    }
};

const actualizarCantidad = async (req, res) => {
    try {
        const { cantidad } = req.body;
        await carritoServicio.actualizarCantidad(req.params.id, req.session.user.id, parseInt(cantidad));
        res.redirect('/carrito');
    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        res.status(500).render('error', { error: 'Error al actualizar cantidad' });
    }
};

module.exports = {
    mostrarCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad
};

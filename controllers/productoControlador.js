const productoServicio = require('../services/productoServicio');
const categoriaServicio = require('../services/categoriaServicio');

const listarProductos = async (req, res) => {
    try {
        // Si es admin, mostrar panel de administración, si no, redirigir a la tienda
        if (req.session.user && req.session.user.perfil === 'admin') {
        const [productos, categorias] = await Promise.all([
            productoServicio.obtenerTodosLosProductos(),
            categoriaServicio.obtenerTodoslasCategorias()
        ]);
            res.render('productos/admin', {
            productos,
            categorias,
                titulo: 'Gestión de Inventario'
        });
        } else {
            res.redirect('/productos/shop');
        }
    } catch (error) {
        console.error('Error al listar productos:', error);
        res.status(500).render('error', { 
            error: 'Error al cargar productos',
            titulo: 'Error'
        });
    }
};

const mostrarTienda = async (req, res) => {
    try {
        const [productos, categorias] = await Promise.all([
            productoServicio.obtenerTodosLosProductos(),
            categoriaServicio.obtenerTodoslasCategorias()
        ]);
        res.render('shop', {
            productos,
            categorias,
            titulo: 'Nuestra Tienda'
        });
    } catch (error) {
        console.error('Error al mostrar tienda:', error);
        res.status(500).render('error', { 
            error: 'Error al cargar la tienda',
            titulo: 'Error'
        });
    }
};

const obtenerProductosJson = async (req, res) => {
    try {
        const productos = await productoServicio.obtenerTodosLosProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

const obtenerProducto = async (req, res) => {
    try {
        const producto = await productoServicio.obtenerProductoPorId(req.params.id);
        if (!producto) {
            return res.status(404).render('error', { error: 'Producto no encontrado' });
        }
        res.render('productos/detalle', { producto });
    } catch (error) {
        res.status(500).render('error', { error: 'Error al obtener el producto' });
    }
};

const crearProducto = async (req, res) => {
    try {
        const nuevoProducto = await productoServicio.crearProducto({
            ...req.body,
            imagen: req.file ? req.file.path : null
        });
        res.redirect('/productos');
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).render('error', { error: 'Error al crear el producto' });
    }
};

const actualizarProducto = async (req, res) => {
    try {
        const resultado = await productoServicio.actualizarProducto(req.params.id, req.body);
        if (resultado) {
            res.redirect('/productos');
        } else {
            res.status(404).render('error', { error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).render('error', { error: 'Error al actualizar el producto' });
    }
};

const eliminarProducto = async (req, res) => {
    try {
        await productoServicio.eliminarProducto(req.params.id);
        res.redirect('/productos');
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).render('error', { error: 'Error al eliminar el producto' });
    }
};

const mostrarFormularioEditarProducto = async (req, res) => {
    try {
        const producto = await productoServicio.obtenerProductoPorId(req.params.id);
        if (producto) {
            res.render('productos/editarProducto', { producto });
        } else {
            res.status(404).render('error', { error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al mostrar formulario:', error);
        res.status(500).render('error', { error: 'Error al cargar el formulario' });
    }
};

const buscarPorNombre = async (req, res) => {
    try {
        const productos = await productoServicio.buscarPorNombre(req.body.buscar);
        res.render('productos/busqueda', { 
            productos, 
            terminoBusqueda: req.body.buscar 
        });
    } catch (error) {
        console.error('Error al buscar productos:', error);
        res.status(500).render('error', { error: 'Error al buscar productos' });
    }
};

module.exports = {
    listarProductos,
    mostrarTienda,
    obtenerProductosJson,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    mostrarFormularioEditarProducto,
    buscarPorNombre
};
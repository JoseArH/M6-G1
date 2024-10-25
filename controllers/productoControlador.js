const productoServicio = require('../services/productoServicio');
const Producto = require('../models/Producto');

const obtenerProductos = async (req, res) => {
  const productos = await productoServicio.obtenerTodosLosProductos();
  res.render('productos/index', { productos });
};

const obtenerProducto = async (req, res) => {
  const producto = await productoServicio.obtenerProductoPorId(req.params.id);
  res.render('productos/detalle', { producto });
};

const crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, inventario, categoria } = req.body;
  await productoServicio.crearProducto({ nombre, descripcion, precio, inventario, categoria });
  res.redirect('/productos');
};

const actualizarProducto = async (req, res) => {
  await productoServicio.actualizarProducto(req.params.id, req.body);
  res.redirect('/productos');
};

const eliminarProducto = async (req, res) => {
  await productoServicio.eliminarProducto(req.params.id);
  res.redirect('/productos');
};

const mostrarFormularioEditarProducto = async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) {
    return res.status(404).send('Producto no encontrado');
  }
  res.render('productos/editarProducto', { producto });
};

// const buscarPorNombre = async (req, res) => {
//   try {
//     await productoServicio.buscarPorNombre(req.params.buscar);
//     // if (!productos) {
//     //   return res.status(404).send('Producto no encontrado');
//     res.render('productos/busqueda');
//   } catch (error) {
//     res.status(500).send({ message: 'Error al obtener productos', error });
//   }
// };

const buscarPorNombre = async (req, res) => {
  try {
  
    const terminoBusqueda = req.body.buscar;
    
    // Si no hay término de búsqueda, podemos manejar ese caso
    if (!terminoBusqueda) {
      return res.render('productos/busqueda', { 
        error: 'Por favor ingrese un término de búsqueda',
        productos: [] 
      });
    }

    const productos = await productoServicio.buscarPorNombre(terminoBusqueda);
    res.render('productos/busqueda', { 
      productos,
      terminoBusqueda 
    });
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    res.status(500).render('productos/busqueda', {
      error: 'Error al buscar productos',
      productos: []
    });
  }
};

const obtenerProductosJson = async (req, res) => {
  try {
    const productos = await productoServicio.obtenerTodosLosProductos();
    return res.json('productos/json'); 
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error });
  }
};


module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  mostrarFormularioEditarProducto,
  obtenerProductosJson,
  buscarPorNombre
};

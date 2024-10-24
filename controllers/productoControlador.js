const productoServicio = require('../services/productoServicio');
const categoriaServicio = require('../services/categoriaServicio');
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

const obtenerProductosJson = async (req, res) => {
  try {
    const productos = await productoServicio.obtenerTodosLosProductos();
    return res.json(productos); 
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
};

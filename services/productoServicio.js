const Producto = require('../models/Producto');
const { Op } = require("sequelize");

const obtenerTodosLosProductos = async () => {
  return await Producto.findAll();
};

const obtenerProductoPorId = async (id) => {
  try {
    return await Producto.findByPk(id);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    throw new Error('Error al obtener el producto');
  }
};

const crearProducto = async (datos) => {
  return await Producto.create(datos);
};

const actualizarProducto = async (id, datos) => {
  const producto = await Producto.findByPk(id);
  if (producto) {
    return await producto.update(datos);
  }
  return null;
};

const eliminarProducto = async (id) => {
  const producto = await Producto.findByPk(id);
  if (producto) {
    return await producto.destroy();
  }
  return null;
};

const buscarPorNombre = async (buscar) => { 
  try{
    return await Producto.findAll({
      where: {
        [Op.or] : [
          {nombre: {[Op.iLike]: `%${buscar}%` }},
          {categoria: {[Op.iLike]: `%${buscar}%` }}]
      }
    })
  }
  catch (error) {
    console.error('Error al buscar producto:', error);
    throw error;
  }
};

const verificarStock = async (productoId, cantidadSolicitada) => {
    const producto = await Producto.findByPk(productoId);
    if (!producto) {
        throw new Error('Producto no encontrado');
    }
    return producto.inventario >= cantidadSolicitada;
};

const actualizarInventario = async (productoId, cantidad, operacion = 'restar') => {
    const producto = await Producto.findByPk(productoId);
    if (!producto) {
        throw new Error('Producto no encontrado');
    }

    const nuevoInventario = operacion === 'restar' 
        ? producto.inventario - cantidad 
        : producto.inventario + cantidad;

    if (nuevoInventario < 0) {
        throw new Error('No hay suficiente inventario');
    }

    return await producto.update({ inventario: nuevoInventario });
};

const obtenerInventarioDisponible = async (productoId) => {
    const producto = await Producto.findByPk(productoId);
    if (!producto) {
        throw new Error('Producto no encontrado');
    }
    return producto.inventario;
};

module.exports = {
  obtenerTodosLosProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  buscarPorNombre,
  verificarStock,
  actualizarInventario,
  obtenerInventarioDisponible
};
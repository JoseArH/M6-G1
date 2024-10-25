const Producto = require('../models/Producto');
const { Op } = require("sequelize");

const obtenerTodosLosProductos = async () => {
  return await Producto.findAll();
};

const obtenerProductoPorId = async (id) => {
  return await Producto.findByPk(id);
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
  console.log("Valor de la busqueda: ", buscar);
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
}

module.exports = {
  obtenerTodosLosProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  buscarPorNombre
};

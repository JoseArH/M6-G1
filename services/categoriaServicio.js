const Categoria = require('../models/Categorias');

const obtenerTodasLasCategorias = async () => {
  return await Categoria.findAll();
};

const obtenerCategoriaPorId = async (id) => {
  return await Categoria.findByPk(id);
};

const crearCategoria = async (datos) => {
  return await Categoria.create(datos);
};

const actualizarCategoria = async (id, datos) => {
  const categoria = await Categoria.findByPk(id);
  if (categoria) {
    return await categoria.update(datos);
  }
  return null;
};

const eliminarCategoria = async (id) => {
  const categoria = await Categoria.findByPk(id);
  if (categoria) {
    return await categoria.destroy();
  }
  return null;
};

module.exports = {
    obtenerTodasLasCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
};

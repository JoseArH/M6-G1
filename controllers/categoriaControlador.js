const categoriaServicio = require('../services/categoriaServicio');

const obtenerCategorias = async (req, res) => {
  const categorias = await categoriaServicio.obtenerTodoslasCategorias();
  res.render('categorias/index', { categorias });
};

const crearCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body;
  await categoriaServicio.crearCategoria({ nombre, descripcion});
  res.redirect('/categorias');
};

module.exports = {
    obtenerCategorias,
    crearCategoria
};

const Categoria = require("../models/Categorias");
const categoriaServicio = require("../services/categoriaServicio");

const obtenerCategorias = async (req, res) => {
  const categorias = await categoriaServicio.obtenerTodoslasCategorias();
  res.render("categorias/index", { categorias });
};

const obtenerCategoriasJson = async (req, res) => {
  const productos = await productoServicio.obtenerTodosLosProductos();
  res.send(productos);
};

const crearCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body;
  await categoriaServicio.crearCategoria({ nombre, descripcion });
  res.redirect("/categorias");
};

const obtenerCategoria = async (req, res) => {
  const categoria = await categoriaServicio.obtenerCategoriaPorId(
    req.params.id
  );
  res.render("categorias/detalle", { categoria });
};

const eliminarCategoria = async (req, res) => {
  await categoriaServicio.eliminarCategoria(req.params.id);
  res.redirect("/categorias");
};

const actualizarCategoria = async (req, res) => {
  await categoriaServicio.actualizarCategoria(req.params.id, req.body);
  res.redirect("/categorias");z
};
const mostrarFormularioEditarCategoria = async (req, res) => {
  const categoria = await Categoria.findByPk(req.params.id);
  if (!categoria) {
    return res.status(404).send("Categoria no encontrado");
  }
  res.render("categorias/editarCategoria", { categoria });
};

module.exports = {
  obtenerCategorias,
  crearCategoria,
  obtenerCategoria,
  eliminarCategoria,
  actualizarCategoria,
  mostrarFormularioEditarCategoria,
  obtenerCategoriasJson,
};

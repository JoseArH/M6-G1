const categoriaServicio = require("../services/categoriaServicio");
const productoServicio = require("../services/productoServicio");
const Producto = require("../models/Producto");

const listarProductos = async (req, res) => {
  try {
    // Si es admin, mostrar panel de administración, si no, redirigir a la tienda
    if (req.session.user && req.session.user.perfil === "admin") {
      const [productos, categorias] = await Promise.all([
        productoServicio.obtenerTodosLosProductos(),
        categoriaServicio.obtenerTodasLasCategorias(),
      ]);
      res.render("productos/admin", {
        productos,
        categorias,
        titulo: "Gestión de Inventario",
      });
    } else {
      res.redirect("/productos/shop");
    }
  } catch (error) {
    console.error("Error al listar productos:", error);
    res.status(500).render("error", {
      error: "Error al cargar productos",
      titulo: "Error",
    });
  }
};

const obtenerProductos = async (req, res) => {
  try {
    const productos = await productoServicio.obtenerTodosLosProductos();
    const categorias = await categoriaServicio.obtenerTodasLasCategorias();
    res.render("productos/index", {
      productos,
      categorias,
      terminoBusqueda: "",
      titulo: "Inventario de Productos"
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).render("error", {
      error: "Error al cargar el inventario de productos",
      titulo: "Error"
    });
  }
};

const obtenerProducto = async (req, res) => {
  const producto = await productoServicio.obtenerProductoPorId(req.params.id);
  res.render("productos/detalle", { producto });
};

const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, inventario, categoria } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null; // Modificar para incluir /uploads/

    await productoServicio.crearProducto({
      nombre,
      descripcion,
      precio,
      inventario,
      categoria,
      imagen,
    });

    res.redirect("/productos");
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).send("Error al crear el producto");
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const datosActualizados = { ...req.body };
    
    // Si hay una nueva imagen, agrégala a los datos actualizados
    if (req.file) {
      datosActualizados.imagen = `/uploads/${req.file.filename}`;
    }

    await productoServicio.actualizarProducto(req.params.id, datosActualizados);
    res.redirect("/productos");
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).send("Error al actualizar el producto");
  }
};

const eliminarProducto = async (req, res) => {
  await productoServicio.eliminarProducto(req.params.id);
  res.redirect("/productos");
};

const mostrarFormularioEditarProducto = async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) {
    return res.status(404).send("Producto no encontrado");
  }
  res.render("productos/editarProducto", { producto });
};

const buscarPorNombre = async (req, res) => {
  try {
    const terminoBusqueda = req.body.buscar;

    if (!terminoBusqueda) {
      return res.render("productos/busqueda", {
        error: "Por favor ingrese un término de búsqueda",
        productos: [],
      });

      const productos = await productoServicio.buscarPorNombre(terminoBusqueda);
      res.render("productos/busqueda", {
        productos,
        terminoBusqueda,
      });
    }
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    res.status(500).render("productos/busqueda", {
      error: "Error al buscar productos",
      productos: [],
    });
  }
};

const obtenerProductosJson = async (req, res) => {
  try {
    const productos = await productoServicio.obtenerTodosLosProductos();
    return res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
};

const obtenerProductoJson = async (req, res) => {
  try {
    const producto = await productoServicio.obtenerProductoPorId(req.params.id);

    return res.json(producto);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
};

const mostrarTienda = async (req, res) => {
  try {
    const [productos, categorias] = await Promise.all([
      productoServicio.obtenerTodosLosProductos(),
      categoriaServicio.obtenerTodasLasCategorias(),
    ]);
    res.render("shop", {
      productos,
      categorias,
      titulo: "Nuestra Tienda",
    });
  } catch (error) {
    console.error("Error al mostrar tienda:", error);
    res.status(500).render("error", {
      error: "Error al cargar la tienda",
      titulo: "Error",
    });
  }
};

module.exports = {
  listarProductos,
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  mostrarFormularioEditarProducto,
  obtenerProductosJson,
  obtenerProductoJson,
  buscarPorNombre,
  mostrarTienda,
};

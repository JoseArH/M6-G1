const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { conectarBD, sequelize } = require("./config/db");
const productoRutas = require("./routes/productoRutas");
const productoRutasApi = require("./routes/productoRutasApi");
const categoriaRutas = require("./routes/categoriaRutas");
const categoriaRutasApi = require("./routes/categoriaRutasApi");
const usuarioRutas = require("./routes/usuarioRuta");
const authRutas = require("./routes/authRutas");
const session = require('express-session');
dotenv.config();

const app = express();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuración de sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET || "una_clave_secreta_temporal",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Middleware para compartir datos de sesión con las vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Configuración de vistas
app.set("view engine", "pug");
app.set("views", "./views");

// Middleware para manejar rutas de autenticación
app.use("/auth", authRutas);

// Conectar a la base de datos
conectarBD();

// Sincronizar modelos con la base de datos
sequelize.sync().then(() => {
  console.log("Modelos sincronizados con la base de datos.");
});

// Sirviendo archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));

app.use("/uploads", express.static("uploads"));

// Ruta principal
app.get("/", (req, res) => {
  res.render("index", { titulo: "Bienvenido a la Tienda" });
});

// Rutas de la aplicación
app.use("/productos", productoRutas); // Incluye todas las rutas de productos
app.use("/api/productos", productoRutasApi); /* rutas api productos */

app.use("/categorias", categoriaRutas);
app.use("/api/categorias", categoriaRutasApi);

app.use("/usuarios", usuarioRutas);

// Configuración del puerto y servidor
const PUERTO = process.env.PUERTO || 3000;
sequelize
  .sync()
  .then(() => {
    console.log("Base de datos conectada");
    app.listen(PUERTO, () => {
      console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
    });
  })
  .catch((err) => {
    console.error("Error al conectar con la base de datos:", err);
  });

module.exports = app;

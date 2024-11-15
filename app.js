require('dotenv').config();

const express = require("express");
const cookieParser = require("cookie-parser");
const { conectarBD, sequelize } = require("./config/db");
const session = require("express-session");
const router = require("./routes");
const carritoRoutes = require('./routes/carritoRoutes');
const webpayRoutes = require("./routes/webpay_plus");

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
    cookie: { secure: process.env.NODE_ENV === 'production' },
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

// Conectar a la base de datos
conectarBD();

// Sirviendo archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Rutas
app.use('/carrito', carritoRoutes);
app.use("/webpay_plus", webpayRoutes);
app.use(router);

// Configuración del puerto y servidor
const PUERTO = process.env.PUERTO || 3000;

sequelize
  .sync()
  .then(() => {
    console.log("Base de datos conectada y modelos sincronizados");
    app.listen(PUERTO, () => {
      console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
    });
  })
  .catch((err) => {
    console.error("Error al conectar con la base de datos:", err);
  });

module.exports = app;

const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { conectarBD, sequelize } = require("./config/db");
const productoRutas = require("./routes/productoRutas");
const categoriasRutas = require("./routes/categoriasRutas");
const usuarioRutas = require("./routes/usuarioRuta");
const authRutas = require('./routes/authRutas');

dotenv.config();

const app = express();

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', './views');

// Middleware para manejar rutas de autenticación
app.use('/auth', authRutas);

// Conectar a la base de datos
conectarBD();

// Sincronizar modelos con la base de datos
sequelize.sync().then(() => {
  console.log("Modelos sincronizados con la base de datos.");
});

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Sirviendo archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));

app.use('/uploads', express.static('uploads'));

// Ruta principal
app.get("/", (req, res) => {
  res.render("index", { titulo: "Bienvenido a la Tienda" });
});

// Rutas de la aplicación
app.use('/productos', productoRutas); // Incluye todas las rutas de productos
app.use('/categorias', categoriasRutas);
app.use('/usuarios', usuarioRutas);

// Configuración del puerto y servidor
const PUERTO = process.env.PUERTO || 3000;
app.listen(PUERTO, () => {
  console.log(`Servidor ejecutándose en el puerto ${PUERTO}`);
});

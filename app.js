const express = require('express');
const { sequelize } = require('./config/db');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();
const app = express();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'una_clave_secreta_temporal',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Middleware para compartir datos de sesión con las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', './views');

// Sirviendo archivos estáticos
app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));

// Rutas
const authRutas = require('./routes/authRutas');
const productoRutas = require('./routes/productoRutas');
const categoriasRutas = require('./routes/categoriasRutas');
const usuarioRutas = require('./routes/usuarioRuta');

app.use('/auth', authRutas);
app.use('/productos', productoRutas);
app.use('/categorias', categoriasRutas);
app.use('/usuarios', usuarioRutas);

// Ruta principal
app.get('/', (req, res) => {
    res.render('index', { titulo: 'Bienvenido a la Tienda' });
});

// Inicialización del servidor
const PUERTO = process.env.PUERTO || 3000;
sequelize.sync().then(() => {
    console.log('Base de datos conectada');
    app.listen(PUERTO, () => {
        console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
    });
}).catch(err => {
    console.error('Error al conectar con la base de datos:', err);
});

module.exports = app;
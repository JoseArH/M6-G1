const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { esAutenticado } = require('../middlewares/auth');

// Rutas de autenticación
router.get('/login', (req, res) => {
    res.render('auth/login', { titulo: 'Iniciar Sesión' });
});

router.post('/login', authController.login);

router.get('/registro', (req, res) => {
    res.render('auth/registro', { titulo: 'Registro' });
});

router.post('/registro', authController.register);

// Cambiar esta implementación para usar el controlador
router.get('/logout', esAutenticado, authController.logout);

module.exports = router;

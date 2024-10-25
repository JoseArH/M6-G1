const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('auth/login', { titulo: 'Login' });
});

router.get('/registro', (req, res) => {
    res.render('auth/registro', { titulo: 'Registro' });
});

module.exports = router;

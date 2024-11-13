const esAutenticado = (req, res, next) => {
    if (req.session && req.session.user) {
        req.user = req.session.user; // Añade esta línea
        next();
    } else {
        res.redirect('/auth/login');
    }
};

const esAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.rol === 'admin') {
        next();
    } else {
        res.redirect('/');
    }
};

const esComprador = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.rol === 'comprador') {
        next();
    } else {
        res.redirect('/admin');
    }
};

module.exports = {
    esAutenticado,
    esAdmin,
    esComprador
};

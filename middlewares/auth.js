const esAutenticado = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

const esAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.perfil === 'admin') {
        next();
    } else {
        res.redirect('/productos');
    }
};

const esComprador = (req, res, next) => {
    if (req.session.user && req.session.user.perfil === 'comprador') {
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

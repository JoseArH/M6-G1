const usuarioServicio = require("../services/usuarioServicio");

const login = async (req, res) => {
  try {
    console.log("Intento de login:", req.body);
    const { correo, contrasena } = req.body;
    const usuario = await usuarioServicio.autenticarUsuario(correo, contrasena);

    if (!usuario) {
      return res.render("auth/login", {
        error: "Credenciales inválidas",
        titulo: "Iniciar Sesión",
      });
    }

    req.session.user = {
      id: usuario.id,
      email: usuario.correo,
      nombre: usuario.nombre,
      rol: usuario.rol,
    };

    console.log("Usuario autenticado:", usuario.correo, "Rol:", usuario.rol);

    req.session.save((err) => {
      if (err) {
        console.error("Error al guardar la sesión:", err);
        return res.render("auth/login", {
          error: "Error al iniciar sesión",
          titulo: "Iniciar Sesión",
        });
      }

      if (usuario.rol === "admin") {
        res.redirect("/admin");
      } else {
        res.redirect("/");
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.render("auth/login", {
      error: "Error al iniciar sesión",
      titulo: "Iniciar Sesión",
    });
  }
};

const register = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena } = req.body;

    await usuarioServicio.crearUsuario({
      nombre,
      apellido,
      correo,
      contrasena,
      rol: "comprador",
    });

    console.log("Usuario registrado exitosamente:", correo);
    res.redirect("/auth/login");
  } catch (error) {
    console.error("Error en registro:", error);
    res.render("auth/registro", {
      error: "Error al registrar usuario: " + error.message,
      valores: req.body,
      titulo: "Registro",
    });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
    }
    res.redirect("/auth/login");
  });
};

module.exports = {
  login,
  register,
  logout,
};

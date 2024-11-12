const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    // Necesario si el nombre de la base de datos tiene espacios
    decimalNumbers: true,
  },
});

const conectarBD = async () => {
  try {
    await sequelize.authenticate();
    console.log("Postgres conectado...");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, conectarBD };

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Categoria = sequelize.define('Categoria', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
  }
});

module.exports = Categoria;

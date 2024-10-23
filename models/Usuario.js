const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,  
    allowNull: false,
    primaryKey: true,
  },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    rol: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });


module.exports = Usuario;
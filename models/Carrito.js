const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Producto = require('./Producto');
const Usuario = require('./Usuario');

const Carrito = sequelize.define('Carrito', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    usuarioId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    productoId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'comprado'),
        defaultValue: 'pendiente'
    }
});

// Definir las asociaciones
Carrito.belongsTo(Producto, { foreignKey: 'productoId' });
Carrito.belongsTo(Usuario, { foreignKey: 'usuarioId' });

module.exports = Carrito;

import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

const Usuario = sequelize.define('Usuario', {
  idUsuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  matricula: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('user', 'manager'),
    allowNull: false,
    defaultValue: 'user'
  }
}, {
  tableName: 'usuarios',
  timestamps: true
});

export default Usuario;
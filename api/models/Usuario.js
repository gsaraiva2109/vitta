import { DataTypes } from 'sequelize';

const initUsuario = (sequelize) => {
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

  return Usuario;
};

export default initUsuario;

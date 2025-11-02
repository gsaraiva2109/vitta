import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

const Maquina = sequelize.define('Maquina', {
  idMaquina: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: DataTypes.STRING,
  patrimonio: DataTypes.STRING,
  dataAquisicao: DataTypes.DATE,
  funcao: DataTypes.STRING,
  intervaloCalibracao: DataTypes.STRING,
  intervaloManutencao: DataTypes.STRING,
  numeroSerie: DataTypes.STRING,
  fabricante: DataTypes.STRING,
  modelo: DataTypes.STRING,
  rcOc: DataTypes.STRING,
  localizacao: DataTypes.STRING,
  observacao: DataTypes.TEXT,
  justificativa: DataTypes.TEXT
}, {
  tableName: 'maquinas',
  timestamps: true
});

export default Maquina;
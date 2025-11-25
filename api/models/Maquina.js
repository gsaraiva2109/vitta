import { DataTypes } from 'sequelize';

const initMaquina = (sequelize) => {
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
    intervaloCalibracao: DataTypes.INTEGER,
    intervaloManutencao: DataTypes.INTEGER,
    numeroSerie: DataTypes.STRING,
    fabricante: DataTypes.STRING,
    modelo: DataTypes.STRING,
    rcOc: DataTypes.STRING,
    status: DataTypes.STRING,
    localizacao: DataTypes.STRING,
    observacao: DataTypes.TEXT,
    justificativa: DataTypes.TEXT
  }, {
    tableName: 'maquinas',
    timestamps: true
  });

  return Maquina;
};

export default initMaquina;

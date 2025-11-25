import { DataTypes } from 'sequelize';

const initManutencao = (sequelize) => {
  const Manutencao = sequelize.define('Manutencao', {
    idManutencao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    valor: DataTypes.DECIMAL(10,2),
    status: DataTypes.STRING,
    tipoManutencao: DataTypes.STRING,
    responsavel: DataTypes.STRING,
    dataManutencao: DataTypes.DATE,
    empresaResponsavel: DataTypes.STRING,
    rcOc: DataTypes.STRING,
    modelo: DataTypes.STRING,
    observacao: DataTypes.TEXT,
    dataProxima: DataTypes.DATE
    // adicionaremos a FK de maquina na index de modelos
  }, {
    tableName: 'manutencoes',
    timestamps: true
  });

  return Manutencao;
};

export default initManutencao;

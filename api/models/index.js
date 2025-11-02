import sequelize from '../config/database.js';
import Usuario from './Usuario.js';
import Maquina from './Maquina.js';
import Manutencao from './Manutencao.js';

// Associações: Maquina 1 -> N Manutencao
Maquina.hasMany(Manutencao, { foreignKey: 'idMaquina', as: 'manutencoes' });
Manutencao.belongsTo(Maquina, { foreignKey: 'idMaquina', as: 'maquina' });

// Exportar para uso em controllers
export {
  sequelize,
  Usuario,
  Maquina,
  Manutencao
};

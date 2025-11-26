import getSequelize from '../config/database.js';
import initUsuario from './Usuario.js';
import initMaquina from './Maquina.js';
import initManutencao from './Manutencao.js';

const sequelize = getSequelize();
const Usuario = initUsuario(sequelize);
const Maquina = initMaquina(sequelize);
const Manutencao = initManutencao(sequelize);

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


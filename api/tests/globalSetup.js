import sequelize, { connectDB } from '../config/database.js';
import '../models/index.js'; // Import models to register them with Sequelize

export default async () => {
  console.log('\n[GlobalSetup] Connecting to database...');
  await connectDB();
  console.log('[GlobalSetup] Wiping and syncing database...');
  await sequelize.sync({ force: true });
  console.log('[GlobalSetup] Database synced. Tests can now run.');
};

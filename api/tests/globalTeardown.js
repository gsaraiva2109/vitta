import { closeDB } from '../config/database.js';

export default async () => {
  console.log('\n[GlobalTeardown] Closing database connection after all tests...');
  await closeDB();
  console.log('[GlobalTeardown] Database connection closed.');
};

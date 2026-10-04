import { createApp } from '../backend/src/app.js';
import { seedDatabase } from '../backend/src/database/seed.js';

try {
  seedDatabase();
} catch (err) {
  console.warn('Database seed notice in serverless context:', err);
}

const app = createApp();

export default app;

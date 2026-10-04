import { createApp } from './app.js';
import { seedDatabase } from './database/seed.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

try {
  // Ensure schema and seeds are loaded
  seedDatabase();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` PERSONAL LOAN RECOMMENDATION ENGINE (Rule-Based)`);
    console.log(` Backend server running at http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/health`);
    console.log(` API Endpoints: http://localhost:${PORT}/api/*`);
    console.log(`=======================================================`);
  });
} catch (err) {
  console.error('Fatal error starting server:', err);
  process.exit(1);
}

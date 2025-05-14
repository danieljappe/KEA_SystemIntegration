// src/index.js
import express from 'express';
import { createWebhookRoutes } from './routes/webhook.js';
import { setupDatabase } from './database.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize database
await setupDatabase();

// Routes
app.use('/api', createWebhookRoutes());

// Simple home route
app.get('/', (req, res) => {
  res.redirect('/docs.html');
});

// Start server
app.listen(PORT, () => {
  console.log(`Webhook exposee server running on http://localhost:${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/docs.html`);
});
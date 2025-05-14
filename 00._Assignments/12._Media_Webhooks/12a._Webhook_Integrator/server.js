// server.js
import express from 'express';

const app = express();
const PORT = 3001;

app.use(express.json());

// Webhook endpoint
app.post('/webhook', (req, res) => {
  console.log('Webhook received:', JSON.stringify(req.body, null, 2));
  
  res.status(200).json({ received: true });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/webhook`);
});
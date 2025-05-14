// src/index.js
import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration
const app = express();
const PORT = process.env.PORT || 3001;
const EXPOSEE_URL = process.env.EXPOSEE_URL || 'http://localhost:3000';
const WEBHOOK_URL = `http://localhost:${PORT}/webhook`;

// Setup for ES modules file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Webhook endpoint
app.post('/webhook', (req, res) => {
  const event = req.body;
  console.log('\n📩 Webhook received:', JSON.stringify(event, null, 2));
  
  // Log to file
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const logFile = path.join(logsDir, `webhook_${timestamp}.json`);
  fs.writeFileSync(logFile, JSON.stringify(event, null, 2));
  
  // Process event (in a real app, this would do something meaningful with the data)
  processEvent(event);
  
  // Respond immediately to acknowledge receipt
  res.status(200).json({ received: true });
});

// Process webhook event
function processEvent(event) {
  const { event_type, action, data } = event;
  
  if (action === 'ping') {
    console.log('🔔 Ping received! Webhook connection working properly.');
    return;
  }
  
  console.log(`⚙️ Processing ${event_type} event...`);
  
  switch (event_type) {
    case 'payment.received':
      console.log(`💰 New payment received: ${data.amount} ${data.currency} (ID: ${data.payment_id})`);
      break;
      
    case 'payment.processed':
      console.log(`✅ Payment processed: ${data.amount} ${data.currency} (ID: ${data.payment_id})`);
      break;
      
    case 'payment.failed':
      console.log(`❌ Payment failed: ${data.amount} ${data.currency} (ID: ${data.payment_id})`);
      console.log(`   Error: ${data.error_code} - ${data.error_message}`);
      break;
      
    case 'invoice.created':
      console.log(`📝 New invoice created: ${data.amount} ${data.currency} (ID: ${data.invoice_id})`);
      console.log(`   Due date: ${data.due_date}`);
      break;
      
    case 'invoice.paid':
      console.log(`💵 Invoice paid: ${data.amount} ${data.currency} (ID: ${data.invoice_id})`);
      break;
      
    case 'invoice.overdue':
      console.log(`⏰ Invoice overdue: ${data.amount} ${data.currency} (ID: ${data.invoice_id})`);
      console.log(`   Days overdue: ${data.days_overdue}`);
      break;
      
    default:
      console.log(`Unknown event type: ${event_type}`);
  }
}

// API route to register a webhook
app.post('/api/register', async (req, res) => {
  const { event_type } = req.body;
  
  if (!event_type) {
    return res.status(400).json({ error: 'Event type is required' });
  }
  
  try {
    const response = await fetch(`${EXPOSEE_URL}/api/webhooks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        event_type
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to register webhook');
    }
    
    console.log(`🔗 Registered webhook for ${event_type}`);
    res.json({
      success: true,
      message: `Successfully registered webhook for ${event_type}`,
      data
    });
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// API route to unregister a webhook
app.post('/api/unregister', async (req, res) => {
  const { event_type } = req.body;
  
  if (!event_type) {
    return res.status(400).json({ error: 'Event type is required' });
  }
  
  try {
    const response = await fetch(`${EXPOSEE_URL}/api/webhooks`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        event_type
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to unregister webhook');
    }
    
    console.log(`🔌 Unregistered webhook for ${event_type}`);
    res.json({
      success: true,
      message: `Successfully unregistered webhook for ${event_type}`,
      data
    });
  } catch (error) {
    console.error('❌ Unregistration error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// API route to test ping
app.get('/api/test-ping', async (req, res) => {
  try {
    const response = await fetch(`${EXPOSEE_URL}/api/ping`);
    const data = await response.json();
    
    console.log('🏓 Triggered ping test');
    res.json({
      success: true,
      message: 'Ping test initiated',
      data
    });
  } catch (error) {
    console.error('❌ Ping error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// API route to simulate an event
app.post('/api/simulate', async (req, res) => {
  const { event_type } = req.body;
  
  if (!event_type) {
    return res.status(400).json({ error: 'Event type is required' });
  }
  
  try {
    const response = await fetch(`${EXPOSEE_URL}/api/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to simulate event');
    }
    
    console.log(`🧪 Simulated ${event_type} event`);
    res.json({
      success: true,
      message: `Successfully simulated ${event_type} event`,
      data
    });
  } catch (error) {
    console.error('❌ Simulation error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// API route to list webhooks
app.get('/api/list-webhooks', async (req, res) => {
  try {
    const response = await fetch(`${EXPOSEE_URL}/api/webhooks`);
    const data = await response.json();
    
    console.log('📋 Listed webhooks');
    res.json({
      success: true,
      webhooks: data
    });
  } catch (error) {
    console.error('❌ List error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Webhook integrator running on http://localhost:${PORT}`);
  console.log(`Connecting to exposee at ${EXPOSEE_URL}`);
});
// src/routes/webhook.js
import express from 'express';
import { 
  registerWebhook, 
  unregisterWebhook, 
  getAllWebhooks 
} from '../database.js';
import { 
  VALID_EVENT_TYPES, 
  validateEventType, 
  validateUrl, 
  pingAllWebhooks, 
  triggerEvent 
} from '../services/webhook.js';

export function createWebhookRoutes() {
  const router = express.Router();
  
  // Get all available event types
  router.get('/events', (req, res) => {
    res.json({
      event_types: VALID_EVENT_TYPES,
      description: 'List of all available event types that can be subscribed to'
    });
  });
  
  // Register a webhook
  router.post('/webhooks', async (req, res) => {
    try {
      const { url, event_type } = req.body;
      
      // Validate required fields
      if (!url || !event_type) {
        return res.status(400).json({ 
          error: 'Missing required fields', 
          required: ['url', 'event_type'] 
        });
      }
      
      // Validate event type and URL
      validateEventType(event_type);
      validateUrl(url);
      
      // Register the webhook
      const webhook = await registerWebhook(url, event_type);
      
      res.status(201).json({
        message: 'Webhook registered successfully',
        webhook
      });
    } catch (error) {
      if (error.message.includes('already registered')) {
        return res.status(409).json({ error: error.message });
      }
      
      res.status(400).json({ error: error.message });
    }
  });
  
  // List all registered webhooks
  router.get('/webhooks', async (req, res) => {
    try {
      const webhooks = await getAllWebhooks();
      res.json(webhooks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Unregister a webhook
  router.delete('/webhooks', async (req, res) => {
    try {
      const { url, event_type } = req.body;
      
      // Validate required fields
      if (!url || !event_type) {
        return res.status(400).json({ 
          error: 'Missing required fields', 
          required: ['url', 'event_type'] 
        });
      }
      
      // Validate event type
      validateEventType(event_type);
      
      // Unregister the webhook
      const result = await unregisterWebhook(url, event_type);
      
      res.json({
        message: 'Webhook unregistered successfully',
        webhook: result
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(400).json({ error: error.message });
    }
  });
  
  // Ping all registered webhooks
  router.get('/ping', async (req, res) => {
    try {
      const result = await pingAllWebhooks();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Simulate an event
  router.post('/simulate', async (req, res) => {
    try {
      const { event_type } = req.body;
      
      if (!event_type) {
        return res.status(400).json({ 
          error: 'Missing required field: event_type',
          valid_events: VALID_EVENT_TYPES
        });
      }
      
      const result = await triggerEvent(event_type);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  return router;
}
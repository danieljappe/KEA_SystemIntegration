// src/services/webhook.js
import fetch from 'node-fetch';
import { getWebhooksByEventType, getAllWebhooks } from '../database.js';

// List of valid event types
export const VALID_EVENT_TYPES = [
  'payment.received',
  'payment.processed',
  'payment.failed',
  'invoice.created',
  'invoice.paid',
  'invoice.overdue'
];

/**
 * Validate if the event type is supported
 */
export function validateEventType(eventType) {
  if (!VALID_EVENT_TYPES.includes(eventType)) {
    throw new Error(`Invalid event type. Valid types are: ${VALID_EVENT_TYPES.join(', ')}`);
  }
  return true;
}

/**
 * Basic URL validation
 */
export function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    throw new Error('Invalid URL format');
  }
}

/**
 * Send a webhook event to a registered URL
 */
export async function sendWebhook(url, payload) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    return {
      url,
      status: 'success',
      statusCode: response.status
    };
  } catch (error) {
    return {
      url,
      status: 'failed',
      error: error.message
    };
  }
}

/**
 * Ping all registered webhooks
 */
export async function pingAllWebhooks() {
  const webhooks = await getAllWebhooks();
  const timestamp = new Date().toISOString();
  const results = [];
  
  for (const webhook of webhooks) {
    const pingPayload = {
      event_type: webhook.event_type,
      action: 'ping',
      timestamp,
      data: { message: 'This is a test ping from the webhook system' }
    };
    
    const result = await sendWebhook(webhook.url, pingPayload);
    results.push({
      ...result,
      event_type: webhook.event_type
    });
  }
  
  return {
    timestamp,
    ping_count: webhooks.length,
    results
  };
}

/**
 * Trigger an event for a specific event type
 */
export async function triggerEvent(eventType) {
  validateEventType(eventType);
  
  const webhooks = await getWebhooksByEventType(eventType);
  const timestamp = new Date().toISOString();
  const eventData = generateEventData(eventType);
  const results = [];
  
  for (const webhook of webhooks) {
    const payload = {
      event_type: eventType,
      action: 'event',
      timestamp,
      data: eventData
    };
    
    const result = await sendWebhook(webhook.url, payload);
    results.push(result);
  }
  
  return {
    event_type: eventType,
    timestamp,
    webhook_count: webhooks.length,
    results
  };
}

/**
 * Generate sample data for an event type
 */
function generateEventData(eventType) {
  const paymentId = `pmt_${Math.random().toString(36).substring(2, 10)}`;
  const invoiceId = `inv_${Math.random().toString(36).substring(2, 10)}`;
  const amount = parseFloat((Math.random() * 1000).toFixed(2));
  
  switch (eventType) {
    case 'payment.received':
      return {
        payment_id: paymentId,
        amount,
        currency: 'USD',
        status: 'received',
        customer_id: `cus_${Math.random().toString(36).substring(2, 10)}`
      };
      
    case 'payment.processed':
      return {
        payment_id: paymentId,
        amount,
        currency: 'USD',
        status: 'processed',
        processed_at: new Date().toISOString()
      };
      
    case 'payment.failed':
      return {
        payment_id: paymentId,
        amount,
        currency: 'USD',
        status: 'failed',
        error_code: 'insufficient_funds',
        error_message: 'The card has insufficient funds to complete the purchase'
      };
      
    case 'invoice.created':
      return {
        invoice_id: invoiceId,
        amount,
        currency: 'USD',
        due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
      };
      
    case 'invoice.paid':
      return {
        invoice_id: invoiceId,
        amount,
        currency: 'USD',
        status: 'paid',
        payment_id: paymentId
      };
      
    case 'invoice.overdue':
      return {
        invoice_id: invoiceId,
        amount,
        currency: 'USD',
        status: 'overdue',
        due_date: new Date(Date.now() - 5*24*60*60*1000).toISOString().split('T')[0],
        days_overdue: 5
      };
      
    default:
      return {};
  }
}
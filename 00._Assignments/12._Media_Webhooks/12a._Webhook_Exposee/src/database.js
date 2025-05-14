// src/database.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db;

/**
 * Setup the database connection and create tables if they don't exist
 */
export async function setupDatabase() {
  db = await open({
    filename: './webhooks.db',
    driver: sqlite3.Database
  });
  
  // Create webhooks table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS webhooks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      event_type TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(url, event_type)
    )
  `);
  
  console.log('Database setup complete');
  return db;
}

/**
 * Get the database connection
 */
export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call setupDatabase() first.');
  }
  return db;
}

/**
 * Register a new webhook
 */
export async function registerWebhook(url, eventType) {
  try {
    const result = await db.run(
      'INSERT INTO webhooks (url, event_type) VALUES (?, ?)',
      [url, eventType]
    );
    return { id: result.lastID, url, eventType };
  } catch (error) {
    // Check if it's a unique constraint error
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Webhook already registered for this event type');
    }
    throw error;
  }
}

/**
 * Unregister a webhook
 */
export async function unregisterWebhook(url, eventType) {
  const result = await db.run(
    'DELETE FROM webhooks WHERE url = ? AND event_type = ?',
    [url, eventType]
  );
  
  if (result.changes === 0) {
    throw new Error('Webhook not found');
  }
  
  return { url, eventType };
}

/**
 * Get all registered webhooks
 */
export async function getAllWebhooks() {
  return db.all('SELECT * FROM webhooks');
}

/**
 * Get webhooks for a specific event type
 */
export async function getWebhooksByEventType(eventType) {
  return db.all('SELECT * FROM webhooks WHERE event_type = ?', [eventType]);
}
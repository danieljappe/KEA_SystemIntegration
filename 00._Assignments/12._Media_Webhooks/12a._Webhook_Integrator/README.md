# Webhook Integration Report

## Introduction

This report documents the implementation of a webhook integration system between a client application and the `system-integration-course.fly.dev` webhook service. Webhooks provide a way for applications to receive real-time notifications when specific events occur, enabling efficient communication between systems.

## Components

The integration consists of two main components:

1. **Webhook Receiver**: A server that listens for and processes incoming webhook events
2. **Registration Client**: A script that registers our webhook URL with the external service

## Implementation Details

### Webhook Receiver

The webhook receiver is a simple Express.js server that:
- Listens for HTTP POST requests at the `/webhook` endpoint
- Parses incoming JSON payloads
- Logs the webhook data for processing
- Responds with a success status to acknowledge receipt

**Code Sample:**
```javascript
// server.js
import express from 'express';

const app = express();
const PORT = 3001;

// Parse JSON bodies
app.use(express.json());

// Webhook endpoint
app.post('/webhook', (req, res) => {
  // Log the webhook data
  console.log('Webhook received:', JSON.stringify(req.body, null, 2));
  
  // Send a success response
  res.status(200).json({ received: true });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/webhook`);
});
```

### Registration Client

The registration client is a Node.js script that:
- Prompts for a webhook URL (the public URL where the webhook receiver can be reached)
- Allows selection of event types to subscribe to
- Registers the webhook with the external service
- Tests the integration by triggering a ping event

**Code Sample:**
```javascript
// register.js
import fetch from 'node-fetch';
import readline from 'readline';

const WEBHOOK_SYSTEM = 'https://system-integration-course.fly.dev';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Webhook Registration');
console.log('Available events: payment.received, payment.processed, payment.failed, payment.refunded');

// Ask for the webhook URL
rl.question('Enter your webhook URL: ', (webhookUrl) => {
  // Ask for the events to register
  rl.question('Enter events to register (comma-separated): ', async (eventsInput) => {
    const events = eventsInput.split(',').map(e => e.trim());
    
    console.log(`Registering webhook ${webhookUrl} for events: ${events.join(', ')}`);
    
    try {
      // Register the webhook
      const response = await fetch(`${WEBHOOK_SYSTEM}/webhooks/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          events: events
        })
      });
      
      const result = await response.json();
      console.log('Registration result:', result);
      
      // Ask if user wants to test with ping
      rl.question('Test with ping? (y/n): ', async (answer) => {
        if (answer.toLowerCase() === 'y') {
          console.log('Sending ping...');
          
          try {
            await fetch(`${WEBHOOK_SYSTEM}/ping`);
            console.log('Ping sent! Check your server for incoming webhook.');
          } catch (error) {
            console.error('Error sending ping:', error.message);
          }
        }
        
        rl.close();
      });
    } catch (error) {
      console.error('Error:', error.message);
      rl.close();
    }
  });
});
```

## Making the Local Server Accessible

To allow the external webhook service to reach our local server, we used `localhost.run` to create a tunnel:

```
ssh -R 80:localhost:3001 localhost.run
```

This generated a public URL (https://c6af53d3052ad6.lhr.life) that forwarded requests to our local server.

## Testing and Verification

The integration was tested by:

1. Running the webhook receiver server locally
2. Creating a public tunnel with localhost.run
3. Registering our webhook URL with the external service
4. Triggering a test ping event
5. Verifying that our server received the webhook event

### Registration Process

![Registration Screenshot](registering.png)

The screenshot above shows the successful registration of our webhook with the external service. We subscribed to the `payment.received` and `payment.processed` event types.

### Webhook Received

![Webhook Received Screenshot](pingreceived.png)

The screenshot above confirms that our webhook receiver successfully received a ping event from the external service, confirming that the integration is working correctly.

## Webhook Payload Format

The webhook events follow this format:

```json
{
  "data": {
    "event": "ping",
    "timestamp": "2025-05-14T15:46:59.689Z",
    "message": "This is a test ping event"
  }
}
```

For actual payment events, the payload would contain transaction details relevant to the specific event type.

## Conclusion

This implementation demonstrates a successful webhook integration between our application and the external webhook service. The system can now receive real-time notifications when payment events occur, enabling responsive handling of payment processing.

Webhooks provide an efficient mechanism for system-to-system communication, eliminating the need for polling and reducing unnecessary API calls. This pattern is particularly useful for event-driven architectures where immediate reactions to external events are required.
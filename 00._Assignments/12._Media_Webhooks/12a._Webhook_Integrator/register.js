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
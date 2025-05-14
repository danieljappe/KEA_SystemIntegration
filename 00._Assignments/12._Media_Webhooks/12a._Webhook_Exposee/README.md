# Webhook Exposee System

This project implements a webhook system that allows users to register webhook endpoints to receive notifications for various payment and invoice events.

## Features

- Register webhooks for specific event types
- Unregister webhooks
- List registered webhooks
- Ping all registered webhooks (for testing)
- Simulate events to trigger webhooks

## Event Types

The system supports the following event types:

- `payment.received` - Triggered when a new payment is received
- `payment.processed` - Triggered when a payment has been successfully processed
- `payment.failed` - Triggered when a payment processing attempt fails
- `invoice.created` - Triggered when a new invoice is created
- `invoice.paid` - Triggered when an invoice is marked as paid
- `invoice.overdue` - Triggered when an invoice becomes overdue

## Getting Started

### Prerequisites

- Node.js (v14.16.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Starting the Server

```bash
npm start
```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

## Documentation

Once the server is running, you can access the API documentation at:

```
http://localhost:3000/docs.html
```

## API Endpoints

- `POST /api/webhooks` - Register a webhook
- `GET /api/webhooks` - List all registered webhooks
- `DELETE /api/webhooks` - Unregister a webhook
- `GET /api/events` - List all available event types
- `GET /api/ping` - Send a test ping to all registered webhooks
- `POST /api/simulate` - Simulate an event and trigger webhooks

## Database

The system uses SQLite to store registered webhooks. The database file is created automatically when the server starts.

## Webhook Payload Format

When an event occurs, registered webhooks will receive a POST request with a JSON payload in the following format:

```json
{
  "event_type": "payment.processed",
  "action": "event",
  "timestamp": "2025-05-14T09:00:00.000Z",
  "data": {
    // Event-specific data
  }
}
```

## Security Considerations

This is a demonstration system. In a production environment, you should consider implementing:

- Authentication for the API endpoints
- Webhook signing to verify the authenticity of webhook payloads
- Rate limiting to prevent abuse
- HTTPS for all communications
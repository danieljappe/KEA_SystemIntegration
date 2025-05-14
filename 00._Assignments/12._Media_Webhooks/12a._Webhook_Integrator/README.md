# Webhook Integrator

This project demonstrates how to integrate with a webhook system. It sets up a simple web server that can register to receive webhook notifications and includes a dashboard UI for easy interaction with the webhook system.

## Features

- Register for webhook events
- Unregister from webhook events
- Test webhook connectivity with ping
- Simulate webhook events
- View registered webhooks
- Dashboard UI for easy interaction

## Getting Started

### Prerequisites

- Node.js (v14.16.0 or higher)
- npm or yarn
- The webhook exposee service should be running

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Configuration

The integrator will connect to the webhook exposee service at `http://localhost:3000` by default. You can change this by setting the `EXPOSEE_URL` environment variable.

### Starting the Server

```bash
npm start
```

The server will start on port 3001 by default. You can change this by setting the `PORT` environment variable.

## Usage

Once the server is running, you can access the dashboard UI at:

```
http://localhost:3001
```

The dashboard allows you to:

1. Register webhooks for specific event types
2. Unregister webhooks
3. Test webhooks with a ping
4. Simulate webhook events
5. View registered webhooks

## Webhook Handling

When a webhook event is received, it is:

1. Logged to the console
2. Saved to a file in the `logs` directory
3. Processed based on the event type

The processing logic is currently just console logging, but in a real application, you would implement business logic to handle each event type appropriately.

## API Endpoints

- `POST /webhook` - Receives webhook events
- `POST /api/register` - Registers a webhook
- `POST /api/unregister` - Unregisters a webhook
- `GET /api/test-ping` - Tests webhook connectivity
- `POST /api/simulate` - Simulates a webhook event
- `GET /api/list-webhooks` - Lists registered webhooks
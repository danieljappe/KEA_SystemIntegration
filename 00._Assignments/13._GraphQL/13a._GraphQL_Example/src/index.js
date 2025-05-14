// src/index.js

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import resolvers from './resolvers/index.js';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the schema file
const typeDefs = fs.readFileSync(join(__dirname, 'schema/schema.graphql'), 'utf-8');

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);
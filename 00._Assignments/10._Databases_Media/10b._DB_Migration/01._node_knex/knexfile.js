import { config } from 'dotenv';
config();

/**
 * @type { import('knex').Knex.Config }
 */
export const client = 'postgresql';
export const connection = {
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};
export const migrations = {
  tableName: 'knex_migrations',
  directory: './migrations'
};

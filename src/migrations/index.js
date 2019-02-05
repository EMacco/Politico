import { Pool } from 'pg';
import { config } from 'dotenv';
import debug from 'debug';

config();
const debugg = debug('index');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  debugg('Database connection successful');
});

pool.end();

pool.on('remove', () => {
  debugg('client removed');
  process.exit(0);
});

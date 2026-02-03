import { createClient } from 'redis';
import { config } from 'dotenv';
config({ path: './.env' });
const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

await redisClient.connect();

export default redisClient;

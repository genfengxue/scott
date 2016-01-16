import config from '../config/config';
import Redis from 'ioredis';
import logger from '../utils/logger';

const client = new Redis(config.redis);

client.on('error', (err) => {
  if (err) {
    logger.fatal('connect to redis error, please check redis config');
    logger.fatal(err);
    process.exit(1);
  }
});

export default client;

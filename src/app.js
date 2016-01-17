import express from 'express';
import config from './config/config';
import configExpress from './config/express';
import polyfill from 'babel-polyfill'; // eslint-disable-line no-unused-vars
import logger from './utils/logger';
import RedisCache from './redis/RedisCache'; // eslint-disable-line no-unused-vars
import http from 'http';

const app = express();

configExpress(app, config);

const server = http.createServer(app);

server.listen(config.port, () => {
  logger.info('Express server listening on port ' + config.port);
});

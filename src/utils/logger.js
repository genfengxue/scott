/**
 * Created by noodles
 * description logs/log4js using Log
 */
import config from '../config/config';
import log4js from 'log4js';
import colors from 'colors';
import fs from 'fs';

const logDirectory = (config.logPath || config.root) + '/log';
  // ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'red',
  info: 'green',
  data: 'blue',
  help: 'cyan',
  warn: 'yellow',
  debug: 'magenta',
  error: 'red',
  fatal: 'rainbow',
});


log4js.configure({
  'appenders': [
    {
      'type': 'dateFile',
      'filename': logDirectory + '/scott',
      'pattern': '-yyyy-MM-dd.log',
      'alwaysIncludePattern': true,
    },
  ],
}, {});

const logger = log4js.getLogger('logs');

exports.info = (message) => {
  if (typeof message !== 'string') {
    message = JSON.stringify(message); // eslint-disable-line no-param-reassign
  }
  console.log(message.info); // eslint-disable-line no-console
  logger.info(message);
};

exports.debug = (message) => {
  if (typeof message !== 'string') {
    message = JSON.stringify(message); // eslint-disable-line no-param-reassign
  }
  console.log(message.debug); // eslint-disable-line no-console
  logger.debug(message);
};

exports.trace = (message) => {
  if (typeof message !== 'string') {
    message = JSON.stringify(message); // eslint-disable-line no-param-reassign
  }
  console.log(message.trace); // eslint-disable-line no-console
  logger.trace(message);
};

exports.warn = (message) => {
  if (typeof message !== 'string') {
    message = JSON.stringify(message); // eslint-disable-line no-param-reassign
  }
  console.log(message.warn); // eslint-disable-line no-console
  logger.warn(message);
};

exports.error = (message) => {
  if (typeof message !== 'string') {
    message = JSON.stringify(message); // eslint-disable-line no-param-reassign
  }
  console.log(message.red); // eslint-disable-line no-console
  logger.error(message);
};

exports.fatal = (message) => {
  if (typeof message !== 'string') {
    message = JSON.stringify(message); // eslint-disable-line no-param-reassign
  }
  console.log(message.rainbow); // eslint-disable-line no-console
  logger.fatal(message);
};

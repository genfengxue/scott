import request from 'superagent';
import config from '../config/config';
import logger from './logger';

const generateError = (err) => {
  return Object.assign(err.response ? err.response.body : {code: err.code}, err.response ? err.response.error : {status: 501, message: 'timeout'}, {raw: err});
};

const timeout = 120 * 1000;

export default {
  get: (path, query) => new Promise((resolve, reject) => {
    const req = request
      .get(config.apiRoot + path)
      .timeout(timeout)
      .accept('application/json');

    if (query) {
      req.query(query);
    }

    req.end((err, res) => {
      if (err) {
        logger.error('get ' + path + ' ' + JSON.stringify(query) + ' http error - ' + JSON.stringify(err));
        reject(generateError(err));
      } else {
        resolve(res.body || res);
      }
    });
  }),

  put: (path, data, query) => new Promise((resolve, reject) => {
    const req = request.put(config.apiRoot + path)
      .timeout(timeout)
      .accept('application/json')
      .send(data);

    if (query) {
      req.query(query);
    }

    req.end((err, res) => {
      if (err) {
        logger.error('put ' + path + ' ' + JSON.stringify(data) + ' http error - ' + JSON.stringify(err));
        reject(generateError(err));
      } else {
        resolve(res.body || res);
      }
    });
  }),

  post: (path, data, query) => new Promise((resolve, reject) => {
    const req = request.post(config.apiRoot + path)
      .timeout(timeout)
      .accept('application/json')
      .send(data);

    if (query) {
      req.query(query);
    }

    req.end((err, res) => {
      if (err) {
        logger.error('post ' + path + ' ' + JSON.stringify(data) + ' http error - ' + JSON.stringify(err));
        reject(generateError(err));
      } else {
        resolve(res.body || res);
      }
    });
  }),

  del: (path, query) => new Promise((resolve, reject) => {
    const req = request.del(config.apiRoot + path)
      .timeout(timeout)
      .accept('application/json');

    if (query) {
      req.query(query);
    }

    req.end((err, res) => {
      if (err) {
        logger.error('del ' + path + ' ' + JSON.stringify(query) + ' http error - ' + JSON.stringify(err));
        reject(generateError(err));
      } else {
        resolve(res.body || res);
      }
    });
  }),
};

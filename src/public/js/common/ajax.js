import request from 'superagent';

const generateError = (err) => {
  console.log('ajax 4', err);
  return Object.assign(err.response ? err.response.body : {code: err.code}, err.response ? err.response.error : {status: 501, message: 'timeout'}, {raw: err});
};

export default {
  get: (path, query) => new Promise((resolve, reject) => {
    const req = request
      .get(path)
      .accept('application/json');

    if (query) {
      req.query(query);
    }

    req.end((err, res) => {
      if (err) {
        reject(generateError(err));
      } else {
        resolve(res.body || res);
      }
    });
  }),

  put: (path, data, query) => new Promise((resolve, reject) => {
    const req = request.put(path)
      .accept('application/json')
      .send(data);

    if (query) {
      req.query(query);
    }

    req.end((err, res) => {
      if (err) {
        reject(generateError(err));
      } else {
        resolve(res.body || res);
      }
    });
  }),

  post: (path, data, query) => new Promise((resolve, reject) => {
    const req = request.post(path)
      .accept('application/json')
      .send(data);

    if (query) {
      req.query(query);
    }

    req.end((err, res) => {
      if (err) {
        reject(generateError(err));
      } else {
        resolve(res.body || res);
      }
    });
  }),

  del: (path, query) => new Promise((resolve, reject) => {
    const req = request.del(path)
      .accept('application/json');
    if (query) {
      req.query(query);
    }
    req.end((err, res) => {
      if (err) {
        reject(generateError(err));
      } else {
        resolve(res.body || res);
      }
    });
  }),
  request,
};

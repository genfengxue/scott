import path from 'path';
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    qiniu: {
      ACCESS_KEY: '07cMjNhILyyOUOy4mes6SWwuwRnytDqrb6Zdlq0U',
      SECRET_KEY: 'NvlDby_4PcpNdWRfyzb5pli2y9mjquzC6Rv2GDnx',
      bucket: 'scott',
      prefix: 'https://o3f47rda5.qnssl.com/',
    },
    pagination: {
      defaultSize: 20,
      maxSize: 100,
    },
    app: {
      name: 'wind',
    },
    port: 8000,
    mongo: 'mongodb://localhost/wind-cms',
    sessionSecret: 'wind-dev',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 0,
    },
    accessLog: false,
    apiRoot: 'http://123.57.72.210:9002/dtp/',
    cookieSecret: 'dsfljkasdjfklsdajfkl',
    rsa: {
      encoding: 'base64',
      privatePem: 'server.pem',
      charset: 'utf8',
    },
    cookieExpire: 7 * 24 * 3600 * 1000, // 7天
    cookieDomain: '.learnwithwind.com',
    weixin: {
      appid: 'wx0a52c2b7fad7d503',
      secret: '8eb2d119d15476f3ef35efb5d0387408',
    },
  },

  test: {
    root: rootPath,
    qiniu: {
      ACCESS_KEY: '07cMjNhILyyOUOy4mes6SWwuwRnytDqrb6Zdlq0U',
      SECRET_KEY: 'NvlDby_4PcpNdWRfyzb5pli2y9mjquzC6Rv2GDnx',
      bucket: 'scott',
      prefix: 'https://o3f47rda5.qnssl.com/',
    },
    pagination: {
      defaultSize: 20,
      maxSize: 100,
    },
    app: {
      name: 'wind',
    },
    port: 8001,
    mongo: 'mongodb://localhost/wind-cms',
    sessionSecret: 'wind-dev',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 0,
    },
    accessLog: false,
    apiRoot: 'http://123.57.72.210:9002/dtp/',
    cookieSecret: 'dsfljkasdjfklsdajfkl',
    rsa: {
      encoding: 'base64',
      privatePem: 'server.pem',
      charset: 'utf8',
    },
    cookieExpire: 7 * 24 * 3600 * 1000, // 7天
    cookieDomain: '.learnwithwind.com',
    weixin: {
      appid: 'wx0a52c2b7fad7d503',
      secret: '8eb2d119d15476f3ef35efb5d0387408',
    },
  },

  production: {
    root: rootPath,
    qiniu: {
      ACCESS_KEY: '07cMjNhILyyOUOy4mes6SWwuwRnytDqrb6Zdlq0U',
      SECRET_KEY: 'NvlDby_4PcpNdWRfyzb5pli2y9mjquzC6Rv2GDnx',
      bucket: 'scott',
      prefix: 'https://o3f47rda5.qnssl.com/',
    },
    pagination: {
      defaultSize: 20,
      maxSize: 100,
    },
    app: {
      name: 'wind',
    },
    port: 8002,
    mongo: 'mongodb://localhost/wind-cms',
    sessionSecret: 'wind-prod',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 1,
    },
    accessLog: true,
    apiRoot: 'http://123.57.72.210:9002/dtp/',
    cookieSecret: 'dsfljkasdjfklsdajfkl',
    rsa: {
      encoding: 'base64',
      privatePem: 'server.pem',
      charset: 'utf8',
    },
    cookieExpire: 7 * 24 * 3600 * 1000, // 7天
    cookieDomain: '.learnwithwind.com',
    weixin: {
      appid: 'wx0a52c2b7fad7d503',
      secret: '8eb2d119d15476f3ef35efb5d0387408',
    },
  },
};

export default config[env];

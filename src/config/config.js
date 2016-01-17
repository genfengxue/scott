import path from 'path';
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    pagination: {
      defaultSize: 20,
      maxSize: 100,
    },
    app: {
      name: 'crp2',
    },
    port: 8000,
    sessionSecret: 'crp2-dev',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 0,
    },
    accessLog: false,
    apiRoot: 'http://123.57.72.210:9002/dtp/',
    redirects: {
      crp: 'http://crptest1.shunshunliuxue.com',
      www: 'http://testsoho.shunshunliuxue.com',
      bi: 'http://101.200.202.48:8766',
    },
    cookieSecret: 'dsfljkasdjfklsdajfkl',
    rsa: {
      encoding: 'base64',
      privatePem: 'server.pem',
      charset: 'utf8',
    },
    cookieExpire: 7 * 24 * 3600 * 1000, // 7天
    cookieDomain: '.shunshunliuxue.com',
    qiniu: {
      ACCESS_KEY: 'qgdHNv_xV0rZgs3ZTTVFc4AQEQxsLoGcSDi2ov7X',
      SECRET_KEY: 'd_spzzJzPcGJPWfD8UDTzW-A8DtCe2VPzB9t_pZ7',
      bucket: 'awscrp',
      host: 'http://7xin9i.com1.z0.glb.clouddn.com',
      prefix: 'crpacc/',
    },
  },

  test: {
    root: rootPath,
    pagination: {
      defaultSize: 20,
      maxSize: 100,
    },
    app: {
      name: 'crp2',
    },
    port: 8001,
    sessionSecret: 'crp2-dev',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 0,
    },
    accessLog: true,
    apiRoot: 'http://123.57.72.210:9002/dtp/',
    redirects: {
      crp: 'http://crptest1.shunshunliuxue.com',
      www: 'http://testsoho.shunshunliuxue.com',
      bi: 'http://101.200.202.48:8766',
    },
    cookieSecret: 'dsfljkasdjfklsdajfkl',
    rsa: {
      encoding: 'base64',
      privatePem: 'server.pem',
      charset: 'utf8',
    },
    cookieExpire: 7 * 24 * 3600 * 1000, // 7天
    cookieDomain: '.shunshunliuxue.com',
    qiniu: {
      ACCESS_KEY: 'qgdHNv_xV0rZgs3ZTTVFc4AQEQxsLoGcSDi2ov7X',
      SECRET_KEY: 'd_spzzJzPcGJPWfD8UDTzW-A8DtCe2VPzB9t_pZ7',
      bucket: 'awscrp',
      host: 'http://7xin9i.com1.z0.glb.clouddn.com',
      prefix: 'crpacc/',
    },
  },

  production: {
    root: rootPath,
    pagination: {
      defaultSize: 20,
      maxSize: 100,
    },
    app: {
      name: 'crp2',
    },
    port: 8002,
    sessionSecret: 'crp2-prod',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 1,
    },
    accessLog: true,
    apiRoot: 'http://123.57.72.210:9002/dtp/',
    redirects: {
      crp: 'http://crp.shunshunliuxue.com',
      www: 'http://www.shunshunliuxue.com',
      bi: 'http://bi.shunshunliuxue.com',
    },
    cookieSecret: 'dsfljkasdjfklsdajfkl',
    rsa: {
      encoding: 'base64',
      privatePem: 'server.pem',
      charset: 'utf8',
    },
    cookieExpire: 7 * 24 * 3600 * 1000, // 7天
    cookieDomain: '.shunshunliuxue.com',
    qiniu: {
      ACCESS_KEY: 'qgdHNv_xV0rZgs3ZTTVFc4AQEQxsLoGcSDi2ov7X',
      SECRET_KEY: 'd_spzzJzPcGJPWfD8UDTzW-A8DtCe2VPzB9t_pZ7',
      bucket: 'awscrp',
      host: 'http://7xin9i.com1.z0.glb.clouddn.com',
      prefix: 'crpacc/',
    },
  },
};

export default config[env];

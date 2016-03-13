import express from 'express';
import logger from '../utils/logger';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import ejsLocals from 'ejs-locals';
import session from 'express-session';
import connectRedis from 'connect-redis';
import fs from 'fs';
import FileStreamRotator from 'file-stream-rotator';
import captcha from '../utils/captcha';
import mongoose from 'mongoose';

const RedisStore = connectRedis(session);
export default (app, config) => {
  mongoose.connect(config.mongo) // connect to our database
  .connection.on('error', (err) => {
    logger.info('connection error:' + JSON.stringify(err));
  }).once('open', () => {
    logger.info('open mongodb success');
  });

  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';
  app.engine('ejs', ejsLocals);
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');
  app.locals._layoutFile = 'layout.ejs';
  app.use(favicon(config.root + '/public/img/favicon.ico'));

  app.use(morgan('dev'));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(session({
    secret: config.sessionSecret,
    store: new RedisStore({
      port: config.redis.port,
      host: config.redis.host,
      db: config.redis.db,
    }),
    resave: false,
    saveUninitialized: true,
  }));
  app.use(captcha({ url: '/captcha.jpg', color: '#0064cd', background: '#FFF' })); // captcha params
  if (env === 'production') {
    app.use(express.static(config.root + '/public', {maxAge: 86400000 * 7}));
  } else {
    app.use(express.static(config.root + '/public'));
  }
  app.use(methodOverride());

  // api 路由定义
  // app.use('/api/auth/', require('../app/apis/auth'));
  app.use('/api/courses/', require('../app/apis/course'));
  app.use('/api/lessons/', require('../app/apis/lesson'));
  app.use('/api/sentences/', require('../app/apis/sentence'));
  app.use('/api/homeworks/', require('../app/apis/homework'));
  app.use('/api/wechat/', require('../app/apis/wechat'));
  app.use('/api/stats/', require('../app/apis/stats'));

  // 页面路由定义
  app.use('/', require('../app/controllers/home'));

  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use((err, req, res, next) => {  // eslint-disable-line no-unused-vars
    res.status(err.status || 500);
    const locals = Object.assign({message: err.message}, {
      error: err,
      title: 'error',
    });
    res.json(locals);
    logger.error(err);
  });
};

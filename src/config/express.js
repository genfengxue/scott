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
import httpProxy from 'http-proxy';

const RedisStore = connectRedis(session);
export default (app, config) => {
  const proxy = httpProxy.createProxyServer({});
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';
  app.engine('ejs', ejsLocals);
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');
  app.locals._layoutFile = 'layout.ejs';
  app.use(favicon(config.root + '/public/img/favicon.ico'));

  const logDirectory = config.root + '/log';
  // ensure log directory exists
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }

  if (config.accessLog) {
    // create a rotating write stream
    const accessLogStream = FileStreamRotator.getStream({
      filename: logDirectory + '/access-%DATE%.log',
      frequency: 'daily',
      verbose: false,
    });
    app.use(morgan('combined', {stream: accessLogStream}));
  } else {
    app.use(morgan('dev'));
  }

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
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());


  // 页面路由定义
  app.use('/', require('../app/controllers/home'));

  // api 路由定义
  app.use('/api/auth/', require('../app/apis/auth'));

  app.use('/dtp/', (req, res, next) => {
    proxy.web(req, res, {
      target: config.apiRoot,
    });
  });

  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use((err, req, res, next) => {  // eslint-disable-line no-unused-vars
    res.status(err.status || 500);
    const locals = Object.assign({message: err.message}, {
      error: app.get('env') === 'development' ? err : {},
      title: 'error',
    });
    if (err.status === 500 && err.text) {
      return res.send(err.text);
    }
    if (/application\/json/.test(req.get('accept'))) {
      res.json(locals);
    } else {
      res.render('error', locals);
    }
    logger.error(err);
  });
};

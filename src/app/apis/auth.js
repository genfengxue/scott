import {Router} from 'express';
import request from '../../utils/request';
import config from '../../config/config';
import {MOBILE_REG} from '../../common/regex';
import security from '../../utils/security';
import {verifySession} from '../middlewares/authChecker';
import RedisCache from '../../redis/RedisCache';
import logger from '../../utils/logger';

const router = new Router();

router.get('/', (req, res, next) => {
  try {
    res.status(200).json({
      'mobile_code': '获取短信验证码 get',
      'login': '登录',
      'register': '注册',
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me/', verifySession(), async (req, res, next) => {
  try {
    const project_type = req.query.app; // eslint-disable-line
    const result = await request.get('userlogin/user_info/', {
      p_id: req.user.p_id,
      project_type,
    });
    let userCache = await RedisCache.get(`${req.user.p_id}`);
    if (!userCache) {
      userCache = {};
    }
    req.session.loginUser = Object.assign(result.result, userCache);
    res.json(req.session.loginUser);
  } catch (err) {
    next(err);
  }
});

router.put('/me/', verifySession(), async (req, res, next) => {
  try {
    const result = await request.post('userlogin/user_info/', Object.assign({p_id: req.session.loginUser.p_id}, req.body));
    req.session.loginUser = result.result;
    res.json(req.session.loginUser);
  } catch (err) {
    next(err);
  }
});

router.get('/mobile_code/', async (req, res, next) => {
  try {
    const errors = [];
    const {mobile, captcha, type} = req.query;
    if (!req.query.mobile) {
      errors.push({mobile: '缺少电话号码'});
    }
    if (captcha && captcha !== req.session.captcha) {
      errors.push({captcha: '验证码错误'});
    }
    if (errors.length) {
      return next({errors, status: 400});
    }
    req.session.lastPhoneCodeTime = new Date();
    // 访问统一登录服务器发送短信接口
    const result = await request.post('userlogin/pollcode/', {mobile, pollcode_type: type});
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/login/', async (req, res, next) => {
  try {
    const {mobile, account, password, code, app, type} = req.body;
    const project_type = app || req.session.app || 'login'; // eslint-disable-line camelcase
    let loginRedirect = req.session.loginRedirect || config.redirects[project_type] || '/';
    let postData = {};
    if (type === 'mobile') {
      postData = {
        login_type: 'pollcode',
        username: mobile,
        pollcode: code,
        project_type,
      };
    } else {
      postData = {
        login_type: MOBILE_REG.test(account) ? 'mobile' : 'email',
        username: account,
        password,
        project_type,
      };
    }
    // set cookie and session
    // todo: set cookie, encrypt p_id
    const result = await request.post('userlogin/login/', postData);
    req.session.loginUser = result.result;
    const token = security.encrypt(JSON.stringify({ // eslint-disable-line camelcase
      p_id: req.session.loginUser.p_id,
      expires: new Date(Date.now() + config.cookieExpire),
    }));
    if (loginRedirect.indexOf('?') > -1) {
      loginRedirect = loginRedirect + `&token=${encodeURIComponent(token)}`; // eslint-disable-line camelcase
    } else {
      loginRedirect = loginRedirect + `?token=${encodeURIComponent(token)}`; // eslint-disable-line camelcase
    }
    res.status(200).json(Object.assign(result, {
      redirect: loginRedirect,
    }));
  } catch (err) {
    // {
    // "成功" : 0,
    // "参数错误": 4,
    // "用户名或密码错误" : 5,
    // "请输入正确的邮箱或手机号": 6,
    // "验证码错误": 7,
    // "邮件发送失败": 8,
    // "短信发送失败": 9,
    // "恭喜你验证成功": 10,
    // "验证已失效": 11,
    // "用户名已存在": 12,
    // }
    switch (err.code) {
    case 4:
      break;
    case 5:
      err.message = '用户名或密码错误';
      err.errors = {username: '用户名或密码错误'};
      break;
    case 6:
      err.message = '请输入正确的邮箱或手机号';
      err.errors = {username: '请输入正确的邮箱或手机号'};
      break;
    case 7:
      err.message = '验证码错误';
      err.errors = {code: '验证码错误'};
      break;
    case 8:
      err.message = '邮件发送失败';
      err.errors = {email: '邮件发送失败'};
      break;
    case 9:
      err.message = '短信发送失败';
      err.errors = {mobile: '短信发送失败'};
      break;
    case 10:
      break;
    case 11:
      err.message = '验证已失效';
      err.errors = {code: '验证已失效'};
      break;
    case 12:
      err.message = '用户名已存在';
      err.errors = {username: '用户名已存在'};
      break;
    case 13:
      err.message = '用户名不存在';
      err.errors = {username: '用户名不存在'};
      break;
    case 'ECONNABORTED':
      err.message = '超时';
      break;
    default:
      break;
    }
    next(err);
  }
});

router.post('/register/', async (req, res, next) => {
  try {
    const {mobile, password, code, app, type, email} = req.body;
    const project_type = app || req.session.app || 'login'; // eslint-disable-line camelcase
    let loginRedirect = req.session.loginRedirect || config.redirects[project_type] || '/';
    let postData = {};
    if (type === 'mobile') {
      postData = {
        login_type: 'pollcode',
        username: mobile,
        pollcode: code,
        password,
        project_type,
      };
    } else {
      postData = {
        login_type: 'email',
        username: email,
        password,
        project_type,
      };
    }
    const result = await request.post('userlogin/register/', postData);
    req.session.loginUser = result.result;

    const token = security.encrypt(JSON.stringify({ // eslint-disable-line camelcase
      p_id: req.session.loginUser.p_id,
      expires: new Date(Date.now() + config.cookieExpire),
    }));
    if (loginRedirect.indexOf('?') > -1) {
      loginRedirect = loginRedirect + `&token=${encodeURIComponent(token)}`; // eslint-disable-line camelcase
    } else {
      loginRedirect = loginRedirect + `?token=${encodeURIComponent(token)}`; // eslint-disable-line camelcase
    }
    res.status(200).json(Object.assign(result, {
      redirect: loginRedirect,
    }));
  } catch (err) {
    // {
    // "成功" : 0,
    // "参数错误": 4,
    // "用户名或密码错误" : 5,
    // "请输入正确的邮箱或手机号": 6,
    // "验证码错误": 7,
    // "邮件发送失败": 8,
    // "短信发送失败": 9,
    // "恭喜你验证成功": 10,
    // "验证已失效": 11,
    // "用户名已存在": 12,
    // }
    switch (err.code) {
    case 4:
      break;
    case 5:
      err.message = '用户名或密码错误';
      err.errors = {username: '用户名或密码错误'};
      break;
    case 6:
      err.message = '请输入正确的邮箱或手机号';
      err.errors = {username: '请输入正确的邮箱或手机号'};
      break;
    case 7:
      err.message = '验证码错误';
      err.errors = {code: '验证码错误'};
      break;
    case 8:
      err.message = '邮件发送失败';
      err.errors = {email: '邮件发送失败'};
      break;
    case 9:
      err.message = '短信发送失败';
      err.errors = {mobile: '短信发送失败'};
      break;
    case 10:
      break;
    case 11:
      err.message = '验证已失效';
      err.errors = {code: '验证已失效'};
      break;
    case 12:
      err.message = '用户名已存在';
      err.errors = {username: '用户名已存在'};
      break;
    case 'ECONNABORTED':
      err.message = '超时';
      break;
    default:
      break;
    }
    next(err);
  }
});

router.post('/forgot/', async (req, res, next) => {
  try {
    const {account, password, code, type} = req.body;
    let postData = {};
    if (type === 'mobile') {
      postData = {
        retrieve_type: 'mobile',
        username: account,
        retrieve_code: code,
        password,
      };
    } else {
      postData = {
        retrieve_type: 'email',
        username: account,
        retrieve_code: code,
        password,
      };
    }
    const result = await request.post('userlogin/retrieve_password/', postData);
    res.json(result);
  } catch (err) {
    // {
    // "成功" : 0,
    // "参数错误": 4,
    // "用户名或密码错误" : 5,
    // "请输入正确的邮箱或手机号": 6,
    // "验证码错误": 7,
    // "邮件发送失败": 8,
    // "短信发送失败": 9,
    // "恭喜你验证成功": 10,
    // "验证已失效": 11,
    // "用户名已存在": 12,
    // }
    next(err);
  }
});

router.get('/retrieve_send_email/', async (req, res, next) => {
  try {
    const {email} = req.query;
    let postData = {};
    postData = {
      email,
    };
    const result = await request.post('userlogin/retrieve_send_email/', postData);

    res.send(result);
  } catch (err) {
    // {
    // "成功" : 0,
    // "参数错误": 4,
    // "用户名或密码错误" : 5,
    // "请输入正确的邮箱或手机号": 6,
    // "验证码错误": 7,
    // "邮件发送失败": 8,
    // "短信发送失败": 9,
    // "恭喜你验证成功": 10,
    // "验证已失效": 11,
    // "用户名已存在": 12,
    // }
    next(err);
  }
});

router.post('/modify_username/', async (req, res, next) => {
  try {
    req.body.p_id = req.session.loginUser.p_id;
    const result = await request.post('userlogin/modify_username/', req.body);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.post('/send_email/', async (req, res, next) => {
  try {
    req.body.p_id = req.session.loginUser.p_id;
    let userCache = await RedisCache.get(`${req.body.p_id}`);
    if (!userCache) {
      userCache = {};
    }
    userCache.lastEmailSentTime = new Date();
    await RedisCache.set(`${req.body.p_id}`, userCache);
    const result = await request.post('userlogin/send_email/', req.body);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

export default router;

import {Router} from 'express';
import config from '../../config/config';
import security from '../../utils/security';
import request from '../../utils/request';
import logger from '../../utils/logger';
import {EMAIL_REG} from '../../common/regex';
import multer from 'multer';
import qiniu from 'qiniu';
import easyimg from 'easyimage';

qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qiniu.SECRET_KEY;
const upload = multer({ dest: `${config.root}/uploads/` });
const router = new Router();

router.get('/', async (req, res) => {
  try {
    res.render('index', {});
  } catch (err) {
    res.redirect('/login/');
  }
});

router.get('/home/*', async (req, res) => {
  try {
    res.render('index', {});
  } catch (err) {
    res.redirect('/login/');
  }
});

// router.get('/login/', async (req, res, next) => {
//   try {
//     if (req.query.type === 'email' || req.query.type === 'mobile') {
//       req.session.loginType = req.query.type;
//     }
//     const loginRedirect = req.query.r ? req.query.r : '';
//     const app = req.query.app;
//     if (req.query.hasOwnProperty('r')) {
//       req.session.loginRedirect = loginRedirect || '';
//     }
//     if (req.query.hasOwnProperty('app')) {
//       req.session.app = app;
//     }
//     const loginType = req.session.loginType;
//     // req.query.mobile && req.session.loginType = false;
//     if (req.session.loginUser) {
//       return res.status(301).redirect('/continue/');
//     }
//     res.render('login', {
//       loginType: loginType,
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// router.get('/continue/', async (req, res, next) => {
//   try {
//     if (!req.session.loginUser) {
//       return res.redirect('/login/');
//     }
//     res.render('continue');
//   } catch (err) {
//     next(err);
//   }
// });

// router.get('/continue/go/', async (req, res, next) => {
//   try {
//     if (!req.session.loginUser) {
//       return res.redirect('/login/');
//     }
//     const project_type = req.session.app || 'login'; // eslint-disable-line camelcase
//     const token = security.encrypt(JSON.stringify({
//       p_id: req.session.loginUser.p_id,
//       expires: new Date(Date.now() + config.cookieExpire),
//     }));
//     let loginRedirect = req.session.loginRedirect || config.redirects[project_type] || '/';
//     if (loginRedirect.indexOf('?') > -1) {
//       loginRedirect = loginRedirect + `&token=${encodeURIComponent(token)}`; // eslint-disable-line camelcase
//     } else {
//       loginRedirect = loginRedirect + `?token=${encodeURIComponent(token)}`; // eslint-disable-line camelcase
//     }
//     res.redirect(loginRedirect);
//   } catch (err) {
//     next(err);
//   }
// });

// router.get('/continue/back/', async (req, res, next) => {
//   try {
//     req.session.loginUser = null;
//     return res.redirect('/login/');
//   } catch (err) {
//     next(err);
//   }
// });

// router.get('/register/', async (req, res, next) => {
//   try {
//     if (req.query.type === 'email' || req.query.type === 'mobile') {
//       req.session.registerType = req.query.type;
//     }
//     // req.query.mobile && req.session.registerType = false;
//     const loginRedirect = req.query.r ? req.query.r : '';
//     const app = req.query.app;
//     const registerType = req.session.registerType;
//     if (req.query.hasOwnProperty('r')) {
//       req.session.loginRedirect = loginRedirect || '';
//     }
//     if (req.query.hasOwnProperty('app')) {
//       req.session.app = app;
//     }
//     res.render('register', {
//       registerType: registerType,
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// router.get('/activate/:key', async (req, res, next) => {
//   try {
//     // http://account.shunshunliuxue.com/activate/f4dab9c2d4d85749a74459b7fa511283
//     // call api: /dtp/userlogin/pollcode/callback/?key=f4dab9c2d4d85749a74459b7fa511283
//     // {"code":10,"result":"恭喜你验证成功"}
//     const result = await request.get('userlogin/pollcode/callback/', {key: req.params.key});
//     req.session.loginUser = result.result;
//     res.redirect('/');
//   } catch (err) {
//     logger.error(err);
//     res.status(400).send('验证失败');
//   }
// });

// router.get('/reset/:key', async (req, res, next) => {
//   try {
//     // http://account.shunshunliuxue.com/reset/f4dab9c2d4d85749a74459b7fa511283_cage@gmail.com
//     if (!req.params.key) {
//       return res.status(400).send('参数错误');
//     }
//     if (!/\_/.test(req.params.key)) {
//       return res.status(400).send('参数错误');
//     }
//     const keys = req.params.key.split('_');
//     const key = keys[0];
//     const email = decodeURIComponent(keys[1]);
//     if (!EMAIL_REG.test(email)) {
//       return res.status(400).send('参数错误');
//     }
//     res.render('emailReset', {vm: {key, email}, errors: {}});
//   } catch (err) {
//     next(err);
//   }
// });

// router.post('/reset/', async (req, res, next) => {
//   try {
//     // http://account.shunshunliuxue.com/reset/f4dab9c2d4d85749a74459b7fa511283_cage@gmail.com
//     if (!req.body.key || !req.body.email) {
//       return res.status(400).send('参数错误');
//     }
//     const {email, key, password, confirmPassword} = req.body;
//     const errors = {};
//     let valid = true;
//     if (!password) {
//       errors.password = '请输入密码';
//       valid = false;
//     }
//     if (password !== confirmPassword) {
//       errors.confirmPassword = '两次密码不一致';
//       valid = false;
//     }
//     if (valid) {
//       const postData = {
//         retrieve_type: 'email',
//         username: email,
//         retrieve_code: key,
//         password,
//       };
//       await request.post('userlogin/retrieve_password/', postData);
//       res.redirect('/login/?type=email');
//     } else {
//       res.render('emailReset', {vm: req.body, errors});
//     }
//   } catch (err) {
//     if (err.code) {
//       return res.render('emailReset', {vm: req.body, errors: {server: '重置连接已失效'}});
//     }
//     next(err);
//   }
// });

// router.get('/logout/', async (req, res, next) => {
//   try {
//     await req.session.destroy();
//     res.redirect(req.query.r || req.headers.referer || '/');
//   } catch (err) {
//     next(err);
//   }
// });

// router.get('/change_password/', async (req, res, next) => {
//   try {
//     res.render('changePassword', {
//       vm: {},
//       errors: {},
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// router.post('/change_password/', async (req, res) => {
//   try {
//     if (req.body['confirm-password'] !== req.body.password) {
//       return res.status(400).render('changePassword', {
//         vm: req.body,
//         errors: {
//           'confirm-password': '两次输入密码不一致',
//         },
//       });
//     }
//     await request.post('userlogin/change_password/', {
//       p_id: req.session.loginUser.p_id,
//       old_password: req.body['old-password'],
//       password: req.body.password,
//     });
//     res.redirect('/');
//   } catch (err) {
//     // "{\"code\":5,\"result\":\"用户名或密码错误\"}"},"status":400}}
//     const errors = {};
//     switch (err.code) {
//     case 5:
//       errors['old-password'] = '密码错误';
//       break;
//     default:
//       break;
//     }
//     res.status(400).render('changePassword', {
//       vm: req.body,
//       errors,
//     });
//   }
// });

// router.get('/forgot/', async (req, res, next) => {
//   try {
//     res.render('forgot', {

//     });
//   } catch (err) {
//     next(err);
//   }
// });

// router.get('/uploads/:key', async (req, res) => {
//   try {
//     // check auth
//     res.sendFile(`${config.root}/uploads/${req.params.key}`);
//   } catch (err) {
//     logger.error(err);
//     res.status('404').end();
//   }
// });

// router.post('/upload/image/', upload.single('file'), async (req, res, next) => {
//   try {
//     const putPolicy = new qiniu.rs.PutPolicy(config.qiniu.bucket);
//     const uptoken = putPolicy.token();
//     const extra = new qiniu.io.PutExtra();

//     await easyimg.thumbnail({
//       src: req.file.path,
//       dst: req.file.path,
//       width: 256,
//     });

//     const result = await new Promise((resolve, reject) => {
//       qiniu.io.putFile(uptoken,
//         `${config.qiniu.prefix}images/${req.file.filename}/${req.file.originalname}`,
//         `${config.root}/uploads/${req.file.filename}`,
//         extra,
//         (err, ret) => {
//           if (err) {
//             return reject(err);
//           }
//           return resolve(ret);
//         }
//       );
//     });

//     res.send(config.qiniu.host + '/' + result.key);
//   } catch (err) {
//     next(err);
//   }
// });

export default router;

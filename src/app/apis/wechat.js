import {Router} from 'express';
import logger from '../../utils/logger';
import wechat from '../../utils/wechat';
import config from '../../config/config';
import randomstring from 'randomstring';

const router = new Router();

router.get('/signature/', async (req, res, next) => {
  try {
    const timestamp = parseInt((new Date()).valueOf() / 1000, 10);
    const noncestr = randomstring.generate(10);
    const url = req.header('Referer');
    logger.info('--signature--' + ' ' + noncestr + ' ' + timestamp + ' ' + url);
    const signature = await wechat.getSignature(noncestr, timestamp, url);
    res.status(200).json({appId: config.weixin.appid, signature, timestamp, nonceStr: noncestr});
  } catch (err) {
    await wechat.reset();
    next(err);
  }
});

export default router;

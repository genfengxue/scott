import {Router} from 'express';
import logger from '../../utils/logger';
import wechat from '../../utils/wechat';
import config from '../../config/config';

const router = new Router();

router.get('/signature/', async (req, res, next) => {
  try {
    const timestamp = parseInt((new Date()).valueOf() / 1000, 10);
    const noncestr = 'helloworld';
    const url = req.header('Referer');
    console.log(noncestr, timestamp, url);
    const signature = await wechat.getSignature(noncestr, timestamp, url);
    res.status(200).json({appId: config.weixin.appid, signature, timestamp, nonceStr: noncestr});
  } catch (err) {
    next(err);
  }
});

export default router;

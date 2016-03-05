import {Router} from 'express';
import logger from '../../utils/logger';

const router = new Router();

router.get('/', async (req, res, next) => {
  try {
    const time = new Date() - (new Date(req.session.startTime));
    logger.info('--learning time--' + ' ' + parseInt(time / 60000, 10));
    res.send({time});
  } catch (err) {
    next(err);
  }
});


export default router;

import {Router} from 'express';
import request from '../../utils/request';
import config from '../../config/config';
import {verifySession} from '../middlewares/authChecker';
import RedisCache from '../../redis/RedisCache';
import logger from '../../utils/logger';
import find from 'lodash/find';

const router = new Router();

const mockData = Array.from(new Array(200), (x, index) => {
  return {
    id: index + 1,
    name: `lesson ${index + 1}`,
    ch: `内容 ${index + 1}`,
    en: `content ${index + 1}`,
  };
});

router.get('/', (req, res, next) => {
  try {
    const page = req.query.page || 0;
    let size = req.query.size || config.pagination.defaultSize;
    if (size > config.pagination.maxSize) {
      size = config.pagination.maxSize;
    }
    const data = mockData.slice(page * size, page * size + size);
    return res.status(200).json({results: data, count: mockData.length});
  } catch (err) {
    next(err);
  }
});

router.get('/:lessonId', (req, res, next) => {
  try {
    if (req.params.lessonId) {
      const lessonId = req.params.lessonId;
      const one = find(mockData, (x) => {
        return x.id == req.params.lessonId;
      });
      if (one) {
        return res.json(one);
      }
      return next({
        status: 404
      });
    }
    return next({
      status: 400,
      message: '参数错误',
    });
  } catch (err) {
    next(err);
  }
});

export default router;

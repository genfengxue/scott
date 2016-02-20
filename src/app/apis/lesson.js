import {Router} from 'express';
import config from '../../config/config';
import {verifySession} from '../middlewares/authChecker';
import RedisCache from '../../redis/RedisCache';
import logger from '../../utils/logger';
import Lesson from '../models/Lesson';
import Course from '../models/Course';

const router = new Router();

router.get('/', async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || config.pagination.defaultSize;
    const {courseNo, hasListen, hasTranslate} = req.query;
    const query = {};
    query.courseNo = courseNo;
    if (hasListen) {
      query.hasListen = hasListen;
    }
    if (hasTranslate) {
      query.hasTranslate = hasTranslate;
    }
    const result = await Lesson.paginate(query, {page, limit, sort: {lessonNo: 1}});
    const course = await Course.findOne({courseNo});
    result.course = course;
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:lessonNo', async (req, res, next) => {
  try {
    if (req.params.lessonNo) {
      const result = await Lesson.findOne({lessonNo: req.params.lessonNo});
      if (result) {
        return res.send(result);
      }
      return next({
        status: 404,
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

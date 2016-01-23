import {Router} from 'express';
import request from '../../utils/request';
import config from '../../config/config';
import {verifySession} from '../middlewares/authChecker';
import RedisCache from '../../redis/RedisCache';
import logger from '../../utils/logger';
import find from 'lodash/find';
import Sentence from '../models/Sentence';
import Course from '../models/Course';
import Lesson from '../models/Lesson';

const router = new Router();

router.get('/', async (req, res, next) => {
  try {
    const page = 1;
    const limit = 1000;
    const {courseNo, lessonNo} = req.query;
    const result = await Sentence.paginate({courseNo, lessonNo}, {page, limit, sort: {sentenceNo: 1}});
    const course = await Course.findOne({courseNo});
    result.course = course;
    const lesson = await Lesson.findOne({lessonNo});
    result.lesson = lesson;
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:sentenceNo', async (req, res, next) => {
  try {
    if (req.params.sentenceNo) {
      const sentence = await Sentence.findOne({sentenceNo: req.params.sentenceNo});
      if (sentence) {
        return res.send(sentence);
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

import {Router} from 'express';
import config from '../../config/config';
import {verifySession} from '../middlewares/authChecker';
import RedisCache from '../../redis/RedisCache';
import logger from '../../utils/logger';
import Lesson from '../models/PronunciationLesson';
import PronunciationCourse from '../models/PronunciationCourse';
import LessonActivity from '../models/LessonActivity';

const  router = new Router();


router.get('/', async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || config.pagination.defaultSize;
    const result = await PronunciationCourse.paginate({}, {page, limit, sort: {courseNo: 1}});
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:courseNo/lessons', async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || config.pagination.defaultSize;
    console.log(req.params.courseNo);

    const query = {};
    query.courseNo = req.params.courseNo;
    const result = await Lesson.paginate(query,{page, limit, sort: {lessonNo: 1}});
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:courseNo/lessons/:lessonNo', async (req, res, next) => {
  try {
    const page = 1;
    const limit = 1000;

    const query = {};
    query.courseNo = req.params.courseNo;
    query.lessonNo = req.params.lessonNo;
    const result = await LessonActivity.paginate(query, {page, limit, sort: {index: 1}});
    res.send(result);
  } catch (err) {
    next(err);
  }
});

export default router;

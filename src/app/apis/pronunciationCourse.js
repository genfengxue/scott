import {Router} from 'express';
import config from '../../config/config';
import Lesson from '../models/PronunciationLesson';
import PronunciationCourse from '../models/PronunciationCourse';
import LessonActivity from '../models/LessonActivity';

const router = new Router();

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
    query.publishedDate = {$lt: new Date()};
    const result = await Lesson.paginate(query, {page, limit, sort: {lessonNo: 1}});
    const course = await PronunciationCourse.findOne({courseNo: req.params.courseNo});
    result.course = course;
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
    const {courseNo, lessonNo} = req.params;
    query.courseNo = req.params.courseNo;
    query.lessonNo = req.params.lessonNo;
    const result = await LessonActivity.paginate(query, {page, limit, sort: {index: 1}});
    const course = await PronunciationCourse.findOne({courseNo});
    result.course = course;
    const lesson = await Lesson.findOne({lessonNo});
    result.lesson = lesson;
    req.session.startTime = new Date();

    res.send(result);
  } catch (err) {
    next(err);
  }
});

export default router;

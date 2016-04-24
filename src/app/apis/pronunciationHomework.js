/**
 * Created by jack on 16/4/3.
 */
import {Router} from 'express';
import config from '../../config/config';
import Homework from '../models/pronunciationhomwork';
import wechat from '../../utils/wechat';
import request from '../../utils/request';
import randomstring from 'randomstring';
import Course from '../models/PronunciationCourse';
import Lesson from '../models/PronunciationLesson';
import LessonActivity from '../models/LessonActivity';

const router = new Router();

router.get('/:homeworkId', async (req, res, next) => {
  try {
    const homeworkId = req.params.homeworkId;
    const result = await Homework.findOne({_id: homeworkId});
    const course = await Course.findOne({courseNo: result.courseNo});
    const lesson = await Lesson.findOne({courseNo: result.courseNo, lessonNo: result.lessonNo});
    const homework = result.toObject();
    homework.course = course;
    homework.lesson = lesson;
    res.send(homework);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {serverIds, nickname, time, lessonActivityId} = req.body;
    const lessonActivity = await LessonActivity.findOne({_id: lessonActivityId});
    const homeworkName = `${nickname}-${lessonActivity.courseNo}-${lessonActivity.lessonNo}朗读作业`;
    const homework = new Homework({lessonNo: lessonActivity.lessonNo, courseNo: lessonActivity.courseNo, homeworkName, nickname, time, serverIds});
    await homework.save();
    res.send(homework);
  } catch (err) {
    next(err);
  }
});

export default router;

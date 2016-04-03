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

const router = new Router();

router.get('/:homeworkId', async (req, res, next) => {
  try {
    const homeworkId = req.params.homeworkId;
    const result = await Homework.findOne({_id: homeworkId});

    const homework = result.toObject();
    res.send(homework);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {serverIds, lessonNo, courseNo, homeworkName, nickname, time, type} = req.body;
    const homework = new Homework({lessonNo, courseNo, homeworkName, nickname, time, serverIds, type});
    await homework.save();
    res.send(homework);
  } catch (err) {
    next(err);
  }
});

export default router;

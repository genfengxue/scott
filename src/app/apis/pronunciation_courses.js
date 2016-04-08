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
    // const result = await PronunciationCourse.paginate({}, {page, limit, sort: {courseNo: 1}});
    const result = {
      "docs":
        [
          {
            "_id":"56ce9c119513f69008278012",
            "courseNo":2,
            "lessonsCount":20,
            "__v":0,
            "chineseTitle":"元音",
            "description":"",
            "englishTitle":"Let's Talk in English",
            "imageUrl":"http://7xqe0p.com1.z0.glb.clouddn.com/course_03_cover_image.PNG",
            "modified":null
          },
          {
            "_id":"56ce9a559513f69008278011",
            "courseNo":3,
            "lessonsCount":30,
            "__v":0,
            "chineseTitle":"辅音",
            "description":"",
            "englishTitle":"Rebecca's dream",
            "imageUrl":"https://o3f47rda5.qnssl.com/content/images/20160328/course_02_cover_image.PNG",
            "modified":null,
            "created":null
          }
        ],
        "total":2,
        "limit":20,
        "page":"1",
        "pages":1
      };
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
    // const result = await Lesson.paginate(query,{page, limit, sort: {lessonNo: 1}});
    const result = {
      "docs":
        [
          {
            "lessonNo":1,
            "courseNo":1,
            "chineseTitle":"Lesson 1",
            "englishTitle":"Lesson 1",
            "lessonCount":20
          },
          {
            "lessonNo":2,
            "courseNo":1,
            "chineseTitle":"Lesson 1",
            "englishTitle":"Lesson 1",
            "lessonCount":20
          }
        ],
          "total":2,
          "limit":20,
          "page":"1",
          "pages":1
        };
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

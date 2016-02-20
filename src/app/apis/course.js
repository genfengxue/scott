import {Router} from 'express';
import config from '../../config/config';
import find from 'lodash/find';
import Course from '../models/Course';

const router = new Router();

router.get('/', async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || config.pagination.defaultSize;
    const result = await Course.paginate({}, {page, limit, sort: {courseNo: 1}});
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:courseNo', async (req, res, next) => {
  try {
    if (req.params.courseNo) {
      const course = await Course.findOne({courseNo: req.params.courseNo});
      if (course) {
        return res.send(course);
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

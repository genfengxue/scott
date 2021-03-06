import {Router} from 'express';
import config from '../../config/config';
import Homework from '../models/Homework';
import wechat from '../../utils/wechat';
import request from '../../utils/request';
import qiniu from 'qiniu';
import randomstring from 'randomstring';
import Course from '../models/Course';
import Lesson from '../models/Lesson';

qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qiniu.SECRET_KEY;

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
    const {serverIds, lessonNo, courseNo, nickname, time, type} = req.body;
    // const accessToken = await wechat.getAccessToken();
    // console.log(`http://file.api.weixin.qq.com/cgi-bin/media/get`, {access_token: accessToken, media_id: serverId});
    // const file = await request.get(`http://file.api.weixin.qq.com/cgi-bin/media/get`, {access_token: accessToken, media_id: serverId});
    // console.log(file);
    // const putPolicy = new qiniu.rs.PutPolicy(config.qiniu.bucket);
    // const uptoken = putPolicy.token();
    // const extra = new qiniu.io.PutExtra();
    // const randomStr = randomstring.generate(10);
    // const key = `homework/${randomStr}.mp3`;
    // const result = await new Promise((resolve, reject) => {
    //   qiniu.io.put(uptoken,
    //     key,
    //     file,
    //     extra,
    //     (err, ret) => {
    //       if (err) {
    //         return reject(err);
    //       }
    //       return resolve(ret);
    //     }
    //   );
    // });
    // const homework = new Homework({lessonNo, courseNo, nickname, time, audio: `${config.qiniu.prefix}${key}`});
    const homework = new Homework({lessonNo, courseNo, nickname, time, serverIds, type});
    await homework.save();
    res.send(homework);
  } catch (err) {
    next(err);
  }
});

export default router;

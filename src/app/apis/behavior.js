import {Router} from 'express';
import Behavior from '../models/Behavior';
import uaParser from 'ua-parser-js';

const router = new Router();

router.get('/', async (req, res, next) => {
  try {
    const ua = uaParser(req.headers['user-agent']);
    const behavior = new Behavior(ua);
    behavior.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    behavior.referer = req.headers.referer;
    behavior.session = req.sessionID;
    behavior.scope = req.query.scope;
    behavior.action = req.query.action;
    behavior.value = req.query.value;
    await behavior.save();
    res.send(new Date().valueOf().toString());
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const ua = uaParser(req.headers['user-agent']);
    const behavior = new Behavior(ua);
    behavior.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    behavior.referer = req.headers.referer;
    behavior.session = req.sessionID;
    behavior.scope = req.body.scope;
    behavior.action = req.body.action;
    behavior.value = req.body.value;
    await behavior.save();
    res.send(new Date().valueOf().toString());
  } catch (err) {
    next(err);
  }
});

export default router;

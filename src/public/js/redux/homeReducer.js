import sentences from './sentences';
import lessons from './lessons';
import courses from './courses';
import pronunciationCourses from './pronunciationCourses';
import listen from './listen';
import translate from './translate';
import shifting from './shifting';
import warm from './warm';
import doingHomework from './doingHomework';
import wxsdk from './wxsdk';
import homework from './homework';
import {combineReducers} from 'redux';

export default combineReducers({
  courses,
  lessons,
  sentences,
  listen,
  translate,
  shifting,
  warm,
  doingHomework,
  wxsdk,
  homework,
  pronunciationCourses,
});

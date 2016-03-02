import sentences from './sentences';
import lessons from './lessons';
import courses from './courses';
import listen from './listen';
import translate from './translate';
import shifting from './shifting';
import warm from './warm';
import translateQuiz from './translateQuiz';
import wxsdk from './wxsdk';
import {combineReducers} from 'redux';

export default combineReducers({
  courses, lessons, sentences, listen, translate, shifting, warm, translateQuiz, wxsdk,
});

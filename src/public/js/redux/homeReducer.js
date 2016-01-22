import sentences from './sentences';
import lessons from './lessons';
import courses from './courses';
import listen from './listen';
import translate from './translate';
import {combineReducers} from 'redux';

export default combineReducers({
  courses, lessons, sentences, listen, translate,
});

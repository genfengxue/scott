import lessons from './lessons';
import listen from './listen';
import translate from './translate';
import {combineReducers} from 'redux';

export default combineReducers({
  lessons, listen, translate,
});

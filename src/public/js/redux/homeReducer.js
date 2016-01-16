import homeViewState from './homeViewState';
import user from './user';
import updateMobileState from './updateMobileState';
import updateEmailState from './updateEmailState';
import {combineReducers} from 'redux';

export default combineReducers({
  homeViewState, user, updateMobileState, updateEmailState,
});

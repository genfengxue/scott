import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';
import {receivedUser, RECEIVED_USER} from './user';
import {changeView, HomeViewSections} from './homeViewState';
import {validateEmail} from '../common/validations';

// ------------------------------------
// Constants
// ------------------------------------
export const DISPLAY_ERRORS = 'DISPLAY_ERRORS';

// ------------------------------------
// Actions
// ------------------------------------
export const displayErrors = createAction(DISPLAY_ERRORS, (errors) => errors);

export const updateUserEmail = (email) => {
  return async (dispatch) => {
    const errors = {};
    if (!validateEmail(email)) {
      errors.email = '邮箱格式错误';
      dispatch(displayErrors(errors));
      return;
    }
    try {
      // await ajax.post('/dtp/userlogin/modify_username/', {
      const response = await ajax.post('/api/auth/modify_username/', {
        modify_type: 'email',
        username: email,
      });
      dispatch(receivedUser(response.result));
      dispatch(changeView(HomeViewSections.SHOW_PROFILE));
    } catch (err) {
      if (err.error) {
        switch (err.error.code) {
        case 12:
          errors.email = '邮箱已存在';
          break;
        case 11:
          errors.code = '手机动态码错误';
          break;
        default:
          break;
        }
      }
      dispatch(displayErrors(errors));
    }
  };
};

export const actions = {
  updateUserEmail,
  displayErrors,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [DISPLAY_ERRORS]: (state, {payload}) => {
    state.errors = payload;
    return Object.assign({}, state);
  },
  [RECEIVED_USER]: (state, {payload}) => {
    state.oldEmail = payload.email;
    state.errors = {};
    return Object.assign({}, state);
  },
}, {
  errors: {},
  countdown: 0,
});

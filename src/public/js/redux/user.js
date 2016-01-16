import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';
import pick from 'lodash.pick';
// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVED_USER = 'RECEIVED_USER';
export const LAST_EMAIL_SENT = 'LAST_EMAIL_SENT';
export const DISPLAY_ERRORS = 'DISPLAY_ERRORS';

// ------------------------------------
// Actions
// ------------------------------------
export const receivedUser = createAction(RECEIVED_USER, (state = {}) => state);
export const displayErrors = createAction(DISPLAY_ERRORS, (errors) => errors);

export const fetchUserAsync = () => {
  return async (dispatch) => {
    const user = await ajax.get('/api/auth/me/');
    dispatch(receivedUser(user));
  };
};

export const updateUserAsync = (data) => {
  return async (dispatch) => {
    const keys = ['avatar_file', 'nickname'];
    const user = await ajax.put('/api/auth/me/', pick(data, keys));
    dispatch(receivedUser(user));
  };
};

export const lastEmailSent = createAction(LAST_EMAIL_SENT, (time) => time);

export const resendEmail = () => {
  return async (dispatch) => {
    const errors = {};
    try {
      await ajax.post('/api/auth/send_email');
      const lastEmailSentTime = new Date();
      dispatch(lastEmailSent(lastEmailSentTime));
    } catch (err) {
      if (err.error) {
        switch (err.error.code) {
        case 13:
          errors.email = '邮箱不存在';
          break;
        case 12:
          errors.email = '邮箱已存在';
          break;
        case 8:
          errors.email = '邮件发送失败';
          break;
        default:
          errors.server = '服务器错误';
          break;
        }
      }
      dispatch(displayErrors(errors));
    }
  };
};

export const actions = {
  receivedUser,
  fetchUserAsync,
  updateUserAsync,
  resendEmail,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [RECEIVED_USER]: (state, {payload}) => payload,
  [LAST_EMAIL_SENT]: (state, {payload}) => {
    state.lastEmailSentTime = payload;
  },
  [DISPLAY_ERRORS]: (state, {payload}) => {
    state.errors = payload;
    return state;
  },
}, {});

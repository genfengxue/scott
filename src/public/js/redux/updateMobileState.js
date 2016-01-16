import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';
import {receivedUser, RECEIVED_USER} from './user';
import {changeView, HomeViewSections} from './homeViewState';
import {validatePhone, validateRequired} from '../common/validations';

// ------------------------------------
// Constants
// ------------------------------------
export const CHANGE_CAPTCHA = 'CHANGE_CAPTCHA';
export const DISPLAY_ERRORS = 'DISPLAY_ERRORS';
export const COUNTDOWN = 'COUNTDOWN';

// ------------------------------------
// Actions
// ------------------------------------
export const changeCaptcha = createAction(CHANGE_CAPTCHA, () => null);
export const displayErrors = createAction(DISPLAY_ERRORS, (errors) => errors);
export const tiktok = createAction(COUNTDOWN, (countdown) => countdown);

export const updateUserMobile = (data) => {
  return async (dispatch) => {
    try {
      const response = await ajax.post('/api/auth/modify_username/', {
        modify_type: 'mobile',
        username: data.mobile,
        pollcode: data.code,
      });
      dispatch(receivedUser(response.result));
      dispatch(changeView(HomeViewSections.SHOW_PROFILE));
    } catch (err) {
      const errors = {};
      if (err.error) {
        switch (err.error.code) {
        case 12:
          errors.mobile = '手机号码已存在';
          break;
        case 11:
          errors.code = '手机动态码错误';
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

export const getCode = ({mobile, captcha}) => {
  return async (dispatch, getState) => {
    const counting = (countdown) => {
      dispatch(tiktok(countdown));
      const donePromise = new Promise((resolve) => {
        const timeInterval = setInterval(() => {
          if (countdown <= 0) {
            clearInterval(timeInterval);
            resolve();
          }
          dispatch(tiktok(countdown--));
        }, 1000);
      });
      return donePromise;
    };
    const updateMobileState = getState().updateMobileState;

    let valid = true;
    // reset error
    const errors = {};

    if (!validatePhone(mobile)) {
      errors.mobile = '手机号格式错误';
      valid = false;
    }

    if (mobile === updateMobileState.oldMobile) {
      errors.mobile = '新手机号应与旧手机号不同';
      valid = false;
    }

    if (!validateRequired(captcha)) {
      errors.captcha = '请输入验证码';
      valid = false;
    }
    if (!valid) {
      dispatch(displayErrors(errors));
      return;
    }

    dispatch(tiktok(60));

    try {
      await ajax.get('/api/auth/mobile_code/', {
        mobile: mobile,
        type: 'modify',
        captcha: captcha,
      });
      dispatch(changeCaptcha());
      dispatch(displayErrors(errors));
    } catch (err) {
      if (err.error && err.error.errors) {
        err.error.errors.forEach((error) => {
          Object.assign(errors, error);
        });
      }
      if (err.error && err.error.code === 6) {
        errors.mobile = '手机号格式错误';
      }
      dispatch(tiktok(0));
      dispatch(displayErrors(errors));
      return;
    }

    await counting(60);
  };
};

export const actions = {
  changeCaptcha,
  updateUserMobile,
  displayErrors,
  getCode,
  tiktok,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [CHANGE_CAPTCHA]: (state) => {
    state.captchaUrl = `/captcha.jpg/?r=${Date.now()}`;
    return Object.assign({}, state);
  },
  [DISPLAY_ERRORS]: (state, {payload}) => {
    state.errors = payload;
    return Object.assign({}, state);
  },
  [COUNTDOWN]: (state, {payload}) => {
    state.countdown = payload;
    return Object.assign({}, state);
  },
  [RECEIVED_USER]: (state, {payload}) => {
    state.oldMobile = payload.mobile;
    return Object.assign({}, state);
  },
}, {
  captchaUrl: `/captcha.jpg/?r=${Date.now()}`,
  errors: {},
  countdown: 0,
});

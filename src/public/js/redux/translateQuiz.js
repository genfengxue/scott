import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';
import history from '../common/history';

// ------------------------------------
// Constants
// ------------------------------------
export const TRANSLATE_QUIZ_ERRORS = 'TRANSLATE_QUIZ_ERRORS';
export const TRANSLATE_QUIZ_INIT = 'TRANSLATE_QUIZ_INIT';
export const RECEIVED_SINGLE_LESSON = 'RECEIVED_SINGLE_LESSON';
export const TOGGLE_REVIEW_MODAL = 'TOGGLE_REVIEW_MODAL';
export const TOGGLE_METHOD_MODAL = 'TOGGLE_METHOD_MODAL';
export const TOGGLE_FEEDBACK_MODAL = 'TOGGLE_FEEDBACK_MODAL';
export const TOGGLE_COLLECTION_MODAL = 'TOGGLE_COLLECTION_MODAL';
export const BEGIN_TRANSLATE_QUIZ = 'BEGIN_TRANSLATE_QUIZ';
export const END_TRANSLATE_QUIZ = 'END_TRANSLATE_QUIZ';
export const CANCEL_SUBMIT = 'CANCEL_SUBMIT';
export const SUBMIT_RECORD = 'SUBMIT_RECORD';
export const UPLOADING_RECORD = 'UPLOADING_RECORD';
export const END_QUIZ = 'END_QUIZ';

// ------------------------------------
// Actions
// ------------------------------------
export const displayErrors = createAction(TRANSLATE_QUIZ_ERRORS, (payload) => payload);
export const translateQuizInit = createAction(TRANSLATE_QUIZ_INIT);
export const receivedSingleLesson = createAction(RECEIVED_SINGLE_LESSON, (payload) => payload);
export const fetchSingleLessonAsync = (courseNo, lessonNo) => {
  return async (dispatch) => {
    try {
      const response = await ajax.get('/api/lessons/' + courseNo + '/' + lessonNo);
      dispatch(receivedSingleLesson(response));
    } catch (err) {
      console.log(err);
    }
  };
};
export const endTranslateQuiz = createAction(END_TRANSLATE_QUIZ, (payload) => payload);
export const toggleCollectionModal = createAction(TOGGLE_COLLECTION_MODAL, (payload) => payload);
export const toggleReviewModal = createAction(TOGGLE_REVIEW_MODAL, (payload) => payload);
export const toggleMethodModal = createAction(TOGGLE_METHOD_MODAL, (payload) => payload);
export const toggleFeedbackModal = createAction(TOGGLE_FEEDBACK_MODAL, (payload) => payload);
export const beginTranslateQuiz = createAction(BEGIN_TRANSLATE_QUIZ);
export const cancelSubmit = createAction(CANCEL_SUBMIT);
export const uploadingRecord = createAction(UPLOADING_RECORD, (payload) => payload);
export const endQuiz = createAction(END_QUIZ, (payload) => payload);
export const endTranslateQuizAsync = (localId) => {
  return async (dispatch) => {
    try {
      const {time} = await ajax.get('/api/stats/');
      if (localId) {
        dispatch(endTranslateQuiz({localId, time}));
      } else {
        wx.stopRecord({
          success: (res) => {
            dispatch(endTranslateQuiz({localId: res.localId, time}));
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
};
export const submitRecordAsync = (payload, wxsdk) => {
  return (dispatch) => {
    if (!payload.localId) {
      return dispatch(displayErrors({server: '录音不存在'}));
    }
    if (!payload.nickname) {
      return dispatch(displayErrors({nickname: '需要输入昵称后才可以提交'}));
    }
    if (!payload.time) {
      return dispatch(displayErrors({time: '请输入练习时间'}));
    }
    dispatch(uploadingRecord(true));
    wx.uploadVoice({
      localId: payload.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success: async (res) => {
        try {
          const serverId = res.serverId; // 返回音频的服务器端ID
          payload.serverId = serverId;
          const response = await ajax.post('/api/homeworks/', payload);
          // go to homework view
          history.pushState(null, `/home/homeworks/${response._id}`);
        } catch (err) {
          dispatch(displayErrors({server: '提交失败，请重试'}));
        }
      },
    });
  };
};

export const actions = {
  displayErrors,
  translateQuizInit,
  fetchSingleLessonAsync,
  receivedSingleLesson,
  toggleCollectionModal,
  toggleReviewModal,
  toggleMethodModal,
  toggleFeedbackModal,
  beginTranslateQuiz,
  endTranslateQuiz,
  cancelSubmit,
  submitRecordAsync,
  endTranslateQuizAsync,
  endQuiz,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [TRANSLATE_QUIZ_ERRORS]: (state, {payload}) => {
    state.errors = payload;
    return Object.assign({}, state);
  },
  [TRANSLATE_QUIZ_INIT]: () => {
    return {errors: {}};
  },
  [RECEIVED_SINGLE_LESSON]: (state, {payload}) => {
    state.lesson = payload;
    return Object.assign({}, state);
  },
  [TOGGLE_COLLECTION_MODAL]: (state, {payload}) => {
    state.showCollectionModal = payload;
    return Object.assign({}, state);
  },
  [TOGGLE_REVIEW_MODAL]: (state, {payload}) => {
    state.showReviewModal = payload;
    return Object.assign({}, state);
  },
  [TOGGLE_METHOD_MODAL]: (state, {payload}) => {
    state.showMethodModal = payload;
    return Object.assign({}, state);
  },
  [TOGGLE_FEEDBACK_MODAL]: (state, {payload}) => {
    state.showFeedbackModal = payload;
    return Object.assign({}, state);
  },
  [BEGIN_TRANSLATE_QUIZ]: (state) => {
    state.quizOn = true;
    return Object.assign({}, state);
  },
  [END_TRANSLATE_QUIZ]: (state, {payload}) => {
    state.quizOn = false;
    state.localId = payload.localId;
    state.time = payload.time;
    return Object.assign({}, state);
  },
  [CANCEL_SUBMIT]: (state) => {
    state.localId = '';
    return Object.assign({}, state);
  },
  [UPLOADING_RECORD]: (state, {payload}) => {
    state.uploadingRecord = payload;
    return Object.assign({}, state);
  },
  [END_QUIZ]: (state, {payload}) => {
    state.tempId = payload;
    state.quizOn = false;
    return Object.assign({}, state);
  },
}, {errors: {}});

import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';
import history from '../common/history';

// ------------------------------------
// Constants
// ------------------------------------
export const DOING_NEWHOMEWORK_ERRORS = 'DOING_NEWHOMEWORK_ERRORS';
export const DOING_NEWHOMEWORK_INIT = 'DOING_NEWHOMEWORK_INIT';
export const RECEIVED_SINGLE_LESSON = 'RECEIVED_SINGLE_LESSON';
export const TOGGLE_REVIEW_MODAL = 'TOGGLE_REVIEW_MODAL';
export const TOGGLE_METHOD_MODAL = 'TOGGLE_METHOD_MODAL';
export const TOGGLE_FEEDBACK_MODAL = 'TOGGLE_FEEDBACK_MODAL';
export const TOGGLE_COLLECTION_MODAL = 'TOGGLE_COLLECTION_MODAL';
export const BEGIN_DOING_NEWHOMEWORK = 'BEGIN_DOING_NEWHOMEWORK';
export const END_DOING_NEWHOMEWORK = 'END_DOING_NEWHOMEWORK';
export const CANCEL_SUBMIT = 'CANCEL_SUBMIT';
export const SUBMIT_RECORD = 'SUBMIT_RECORD';
export const UPLOADING_RECORD = 'UPLOADING_RECORD';
export const END_QUIZ = 'END_QUIZ';
export const TOGGLE_ANSWER_MODAL = 'TOGGLE_ANSWER_MODAL';

// ------------------------------------
// Actions
// ------------------------------------
export const displayErrors = createAction(DOING_NEWHOMEWORK_ERRORS, (payload) => payload);
export const doingNewhomeworkInit = createAction(DOING_NEWHOMEWORK_INIT);
export const receivedSingleLesson = createAction(RECEIVED_SINGLE_LESSON, (payload) => payload);
export const toggleAnswerModal = createAction(TOGGLE_ANSWER_MODAL, (payload) => payload);
export const fetchSingleLessonAsync = (courseNo, lessonNo) => {
  return async (dispatch) => {
    try {
      const response = await ajax.get('/api/lessons/' + courseNo + '/' + lessonNo);
      dispatch(receivedSingleLesson(response));
    } catch (err) {
      console.log('redux/doingNewhomework 34', err);
    }
  };
};
export const endTranslateQuiz = createAction(END_DOING_NEWHOMEWORK, (payload) => payload);
export const toggleCollectionModal = createAction(TOGGLE_COLLECTION_MODAL, (payload) => payload);
export const toggleReviewModal = createAction(TOGGLE_REVIEW_MODAL, (payload) => payload);
export const toggleMethodModal = createAction(TOGGLE_METHOD_MODAL, (payload) => payload);
export const toggleFeedbackModal = createAction(TOGGLE_FEEDBACK_MODAL, (payload) => payload);
export const beginTranslateQuiz = createAction(BEGIN_DOING_NEWHOMEWORK);
export const cancelSubmit = createAction(CANCEL_SUBMIT);
export const uploadingRecord = createAction(UPLOADING_RECORD, (payload) => payload);
export const endQuiz = createAction(END_QUIZ, (payload) => payload);
export const endTranslateQuizAsync = (localIds) => {
  return async (dispatch) => {
    try {
      const {time} = await ajax.get('/api/stats/');
      dispatch(endTranslateQuiz({localIds, time}));
    } catch (err) {
      console.log('redux/doingNewhomework 54', err);
    }
  };
};

const uploadSingle = async (localId) => {
  return new Promise((resolve, reject) => {
    wx.uploadVoice({
      localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success: async (res) => {
        resolve(res.serverId);
      },
      fail: (err) => {
        console.log('redux/doingNewhomework 68', err);
        reject(err);
      },
    });
  });
};

export const submitRecordAsync = (payload, wxsdk) => {
  return async (dispatch) => {
    if (!payload.localIds) {
      return dispatch(displayErrors({server: '录音不存在'}));
    }
    if (!payload.nickname) {
      return dispatch(displayErrors({nickname: '需要输入昵称后才可以提交'}));
    }
    if (!payload.time) {
      return dispatch(displayErrors({time: '请输入练习时间'}));
    }
    dispatch(uploadingRecord(true));

    const localIds = payload.localIds.slice();

    const serverIds = [];
    while (localIds.length > 0) {
      const localId = localIds.pop();
      try {
        const serverId = await uploadSingle(localId);
        serverIds.splice(0, 0, serverId);
      } catch (err) {
        dispatch(displayErrors({server: '上传失败，请重试'}));
        throw err;
      }
    }
    payload.serverIds = serverIds;

    try {
      const response = await ajax.post('/api/newhomeworks/', payload);
      // go to newhomework view
      history.pushState(null, `/home/newhomeworks/${response._id}`);
    } catch (err) {
      dispatch(displayErrors({server: '提交失败，请重试'}));
    }
  };
};

export const actions = {
  displayErrors,
  doingNewhomeworkInit,
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
  toggleAnswerModal,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [DOING_NEWHOMEWORK_ERRORS]: (state, {payload}) => {
    state.errors = payload;
    return Object.assign({}, state);
  },
  [DOING_NEWHOMEWORK_INIT]: () => {
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
  [BEGIN_DOING_NEWHOMEWORK]: (state) => {
    state.quizOn = true;
    return Object.assign({}, state);
  },
  [END_DOING_NEWHOMEWORK]: (state, {payload}) => {
    state.quizOn = false;
    state.localIds = payload.localIds.slice();
    state.time = payload.time;
    return Object.assign({}, state);
  },
  [CANCEL_SUBMIT]: (state) => {
    state.localIds = null;
    return Object.assign({}, state);
  },
  [UPLOADING_RECORD]: (state, {payload}) => {
    state.uploadingRecord = payload;
    return Object.assign({}, state);
  },
  [END_QUIZ]: (state, {payload}) => {
    state.quizOn = false;
    return Object.assign({}, state);
  },
  [TOGGLE_ANSWER_MODAL]: (state, {payload}) => {
    state.showAnswerModal = payload;
    return Object.assign({}, state);
  },
}, {errors: {}});

import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';
import history from '../common/history';

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVED_PRONUNCIATION_LESSONS_ACTIVITY = 'RECEIVED_PRONUNCIATION_LESSONS_ACTIVITY';
export const PRONUNCIATION_LESSONS_ACTIVITY_INDEX_CHANGE = 'PRONUNCIATION_LESSONS_ACTIVITY_INDEX_CHANGE';
export const BEGINRECORD = 'BEGINRECORD';
export const ENDRECORD = 'ENDRECORD';
export const END_PRONUNCIATION_HOMEWORK = 'END_PRONUNCIATION_HOMEWORK';
export const PRONUNCIATION_HOMEWORK_ERRORS = 'PRONUNCIATION_HOMEWORK_ERRORS';
export const UPLOADING_RECORD = 'UPLOADING_RECORD';
export const CLEAR_RECORDS = 'CLEAR_RECORDS';
export const BEGIN_SUBMIT = 'BEGIN_SUBMIT';
// ------------------------------------
// Actions
// ------------------------------------
export const displayErrors = createAction(PRONUNCIATION_HOMEWORK_ERRORS, (payload) => payload);
export const receviedPronunciationLessonsActivity = createAction(RECEIVED_PRONUNCIATION_LESSONS_ACTIVITY, (payload) => payload);
export const pronunciationLessonsActivityIndexChange = createAction(PRONUNCIATION_LESSONS_ACTIVITY_INDEX_CHANGE, (payload) => payload);
export const beginRecord = createAction(BEGINRECORD);
export const endRecord = createAction(ENDRECORD);
export const uploadingRecord = createAction(UPLOADING_RECORD, (payload) => payload);
export const endPronunciationHomework = createAction(END_PRONUNCIATION_HOMEWORK, (payload) => payload);
export const clearRecords = createAction(CLEAR_RECORDS, (payload) => payload);
export const beginSubmit = createAction(BEGIN_SUBMIT, (payload) => payload);
export const fetchPronunciationLessonsActivityAsync = (courseNo, lessonNo) => {
  return async (dispatch) => {
    try {
      const response = await ajax.get(`api/pronunciation_courses/${courseNo}/lessons/${lessonNo}`, {page: 1});
      dispatch(receviedPronunciationLessonsActivity(response));
    } catch (err) {
      console.error('fetch pronunciation lessons activity error');
    }
  };
};
export const endPronunciationHomeworkAsync = (localIds) => {
  return async (dispatch) => {
    try {
      const {time} = await ajax.get('/api/stats/');
      dispatch(endPronunciationHomework({localIds, time}));
    } catch (err) {
      console.log('redux/doingHomework 54', err);
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
        console.log('redux/doingHomework 68', err);
        reject(err);
      },
    });
  });
};

export const submitRecordAsync = (payload) => {
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
      const response = await ajax.post('/api/pronunciation_homeworks/', payload);
      // go to homework view
      history.pushState(null, `/home/pronunciation_homeworks/${response._id}`);
    } catch (err) {
      dispatch(displayErrors({server: '提交失败，请重试'}));
    }
  };
};

export const actions = {
  receviedPronunciationLessonsActivity,
  fetchPronunciationLessonsActivityAsync,
  pronunciationLessonsActivityIndexChange,
  beginRecord,
  endRecord,
  endPronunciationHomeworkAsync,
  submitRecordAsync,
  clearRecords,
  beginSubmit,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [PRONUNCIATION_HOMEWORK_ERRORS]: (state, {payload}) => {
    state.errors = payload;
    return Object.assign({}, state);
  },
  [RECEIVED_PRONUNCIATION_LESSONS_ACTIVITY]: (state, {payload}) => {
    return Object.assign({}, state, payload);
  },
  [PRONUNCIATION_LESSONS_ACTIVITY_INDEX_CHANGE]: (state, {payload}) => {
    return Object.assign({}, state, {activityIndex: payload});
  },
  [BEGINRECORD]: (state) => {
    return Object.assign({}, state, {recording: true});
  },
  [ENDRECORD]: (state) => {
    return Object.assign({}, state, {recording: false});
  },
  [UPLOADING_RECORD]: (state, {payload}) => {
    state.uploadingRecord = payload;
    return Object.assign({}, state);
  },
  [END_PRONUNCIATION_HOMEWORK]: (state, {payload}) => {
    state.localIds = payload.localIds.slice();
    state.time = payload.time;
    return Object.assign({}, state);
  },
  [CLEAR_RECORDS]: (state, {payload}) => {
    state.localIds = null;
    state.time = null;
    return Object.assign({}, state);
  },
  [BEGIN_SUBMIT]: (state) => {
    state.submitting = true;
    return Object.assign({}, state);
  },
}, {docs: [], activityIndex: 0});

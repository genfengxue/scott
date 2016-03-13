import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';

// ------------------------------------
// Constants
// ------------------------------------
export const HOMEWORK_ERRORS = 'HOMEWORK_ERRORS';
export const HOMEWORK_INIT = 'HOMEWORK_INIT';
export const RECEIVED_SINGLE_HOMEWORK = 'RECEIVED_SINGLE_HOMEWORK';
export const TOGGLE_PLAY = 'TOGGLE_PLAY';

// ------------------------------------
// Actions
// ------------------------------------
export const displayErrors = createAction(HOMEWORK_ERRORS, (payload) => payload);
export const homeworkInit = createAction(HOMEWORK_INIT);
export const receivedSingleHomework = createAction(RECEIVED_SINGLE_HOMEWORK, (payload) => payload);
export const togglePlay = createAction(TOGGLE_PLAY, (payload) => payload);
export const fetchSingleHomeworkAsync = (homeworkId) => {
  return async (dispatch) => {
    try {
      const response = await ajax.get('/api/homeworks/' + homeworkId);
      dispatch(receivedSingleHomework(response));
    } catch (err) {
      console.log(err);
    }
  };
};

export const actions = {
  displayErrors,
  homeworkInit,
  fetchSingleHomeworkAsync,
  receivedSingleHomework,
  togglePlay,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [HOMEWORK_ERRORS]: (state, {payload}) => {
    state.errors = payload;
    return Object.assign({}, state);
  },
  [HOMEWORK_INIT]: () => {
    return {errors: {}, playing: {}};
  },
  [RECEIVED_SINGLE_HOMEWORK]: (state, {payload}) => {
    return Object.assign(state, payload);
  },
  [TOGGLE_PLAY]: (state, {payload}) => {
    console.log('homeworks toggleplay');
    state.playing = Object.assign(state.playing, payload);;
    return Object.assign({}, state);
  },
}, {errors: {}, playing: {}});

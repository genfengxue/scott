import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';

// ------------------------------------
// Constants
// ------------------------------------
export const NEWHOMEWORK_ERRORS = 'NEWHOMEWORK_ERRORS';
export const NEWHOMEWORK_INIT = 'NEWHOMEWORK_INIT';
export const RECEIVED_SINGLE_NEWHOMEWORK = 'RECEIVED_SINGLE_NEWHOMEWORK';
export const TOGGLE_PLAY = 'TOGGLE_PLAY';

// ------------------------------------
// Actions
// ------------------------------------
export const displayErrors = createAction(NEWHOMEWORK_ERRORS, (payload) => payload);
export const newhomeworkInit = createAction(NEWHOMEWORK_INIT);
export const receivedSingleNewhomework = createAction(RECEIVED_SINGLE_NEWHOMEWORK, (payload) => payload);
export const togglePlay = createAction(TOGGLE_PLAY, (payload) => payload);
export const fetchSingleNewhomeworkAsync = (newhomeworkId) => {
  return async (dispatch) => {
    try {
      const response = await ajax.get('/api/newhomeworks/' + newhomeworkId);
      dispatch(receivedSingleNewhomework(response));
    } catch (err) {
      console.log('redux/newhomework 25', err);
    }
  };
};

export const actions = {
  displayErrors,
  newhomeworkInit,
  fetchSingleNewhomeworkAsync,
  receivedSingleNewhomework,
  togglePlay,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [NEWHOMEWORK_ERRORS]: (state, {payload}) => {
    state.errors = payload;
    return Object.assign({}, state);
  },
  [NEWHOMEWORK_INIT]: () => {
    return {errors: {}, playing: {}};
  },
  [RECEIVED_SINGLE_NEWHOMEWORK]: (state, {payload}) => {
    return Object.assign(state, payload);
  },
  [TOGGLE_PLAY]: (state, {payload}) => {
    state.playing = payload;
    return Object.assign({}, state);
  },
}, {errors: {}, playing: {}});

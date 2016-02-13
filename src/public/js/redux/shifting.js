import {createAction, handleActions} from 'redux-actions';

// ------------------------------------
// Constants
// ------------------------------------
export const TOGGLE_SPEEDS = 'TOGGLE_SPEEDS';
export const SHIFT_SPEED = 'SHIFT_SPEED';

// ------------------------------------
// Actions
// ------------------------------------
export const toggleSpeeds = createAction(TOGGLE_SPEEDS);
export const shiftSpeed = createAction(SHIFT_SPEED, (payload) => payload);

export const actions = {
  toggleSpeeds,
  shiftSpeed,
};

export const RATES = ['0.8', '1.0', '1.1', '1.2', '1.4', '2.0']; // prod

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [TOGGLE_SPEEDS]: (state) => {
    state.showSpeeds = !state.showSpeeds;
    return Object.assign({}, state);
  },
  [SHIFT_SPEED]: (state, {payload}) => {
    state.speed = payload;
    return Object.assign({}, state);
  },
}, {showSpeeds: false, speed: '1.0'});

import {createAction, handleActions} from 'redux-actions';

// ------------------------------------
// Constants
// ------------------------------------
export const CHANGE_VIEW = 'CHANGE_VIEW';
export const HomeViewSections = {
  SHOW_PROFILE: 'SHOW_PROFILE',
  UPDATE_MOBILE: 'UPDATE_MOBILE',
  UPDATE_EMAIL: 'UPDATE_EMAIL',
  UPDATE_NICKNAME: 'UPDATE_NICKNAME',
};

// ------------------------------------
// Actions
// ------------------------------------
export const changeView = createAction(CHANGE_VIEW, (state = {}) => state);

export const actions = {
  changeView,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [CHANGE_VIEW]: (state, {payload}) => payload,
}, HomeViewSections.SHOW_PROFILE);

import babelPolyfill from 'babel-polyfill'; // eslint-disable-line no-unused-vars
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import { createHistory, useBasename } from 'history';
import Root from './containers/Root';
import routes from './routes/home';
import homeReducer from './redux/homeReducer';

import {
  applyMiddleware,
  compose,
  createStore,
} from 'redux';
import thunk from 'redux-thunk';

let createStoreWithMiddleware;
const middleware = applyMiddleware(thunk);
if (__DEV__) {
  createStoreWithMiddleware = compose(
    middleware,
    window.devToolsExtension
      ? window.devToolsExtension()
      : require('./containers/DevTools').default.instrument()
  );
} else {
  createStoreWithMiddleware = compose(middleware);
}
const store = createStoreWithMiddleware(createStore)(
  homeReducer, {}
);
window.dispatch = store.dispatch;
const history = useBasename(createHistory)({
});

ReactDom.render(<Root history={history} routes={routes} store={store} />, document.getElementById('app'));

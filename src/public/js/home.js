import babelPolyfill from 'babel-polyfill'; // eslint-disable-line no-unused-vars
import React from 'react';
import { browserHistory } from 'react-router';
import ReactDom from 'react-dom';
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
createStoreWithMiddleware = compose(middleware);
const store = createStoreWithMiddleware(createStore)(
  homeReducer, {}
);

window.dispatch = store.dispatch;

ReactDom.render(<Root history={browserHistory} routes={routes} store={store} />, document.getElementById('app'));

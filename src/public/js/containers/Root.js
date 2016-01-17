import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

export default class Root extends React.Component {
  static propTypes = {
    history: React.PropTypes.object.isRequired,
    routes: React.PropTypes.element.isRequired,
    store: React.PropTypes.object.isRequired
  };

  get content () {
    return (
      <Router history={this.props.history}>
        {this.props.routes}
      </Router>
    );
  }

  get devTools () {
    if (__DEV__) {
      if (!window.devToolsExtension) {
        require('../redux/createDevToolsWindow').default(this.props.store);
      } else {
        window.devToolsExtension.open();
      }
    }
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <div style={{ height: '100%' }}>
          {this.content}
          {this.devTools}
        </div>
      </Provider>
    );
  }
}

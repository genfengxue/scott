import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
export default class Root extends React.Component {
  static propTypes = {
    history: React.PropTypes.object.isRequired,
    routes: React.PropTypes.element.isRequired,
    store: React.PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.state = {};
  }

  get content() {
    return (
      <Router history={this.props.history}>
        {this.props.routes}
      </Router>
    );
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <div>
          {this.content}
        </div>
      </Provider>
    );
  }
}

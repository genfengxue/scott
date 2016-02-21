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

  drawCircle(e) {
    const event = e.nativeEvent;
    this.setState(Object.assign(this.state, {dotTop: event.clientY, dotLeft: event.clientX, showDot: true}));
    setTimeout(() => {
      this.setState(Object.assign(this.state, {dotTop: event.clientY, dotLeft: event.clientX, showDot: false}));
    }, 200);
  }

  render() {
    // onClick={e => this.drawCircle(e)}
    return (
      <Provider store={this.props.store}>
        <div style={{ height: '100%' }}>
          {this.content}
          <div className={`touch-dot${this.state.showDot ? ' active' : ''}`} style={{top: this.state.dotTop, left: this.state.dotLeft}}></div>
        </div>
      </Provider>
    );
  }
}

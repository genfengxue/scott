import React, { PropTypes, Component } from 'react';
import { browserHistory } from 'react-router';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

class Link extends Component {

  static propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    state: PropTypes.object,
    onClick: PropTypes.func,
  };

  static handleClick = event => {
    let allowTransition = true;
    let clickResult;

    if (this.props && this.props.onClick) {
      clickResult = this.props.onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (clickResult === false || event.defaultPrevented === true) {
      allowTransition = false;
    }

    event.preventDefault();

    if (allowTransition) {
      const link = event.currentTarget;
      browserHistory.push(
        this.props && this.props.state || null,
        this.props && this.props.to || (link.pathname + link.search));
    }
  };

  render() {
    const { to, children, ...props } = this.props;
    return <span onClick={Link.handleClick.bind(this)} {...props}>{children}</span>;
  }

}

export default Link;

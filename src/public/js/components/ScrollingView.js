import React, {PropTypes} from 'react';
import ScrollLockMixin from '../common/ScrollLock';

const ScrollingView = React.createClass({
  propTypes: {
    children: PropTypes.array,
  },

  mixins: [ScrollLockMixin],

  componentDidMount: function componentDidMount() {
    this.scrollLock();
  },

  componentWillUnmount: function componentWillUnmount() {
    this.scrollRelease();
  },

  render: function render() {
    return <div {...this.props}>{this.props.children}</div>;
  },
});
export default ScrollingView;

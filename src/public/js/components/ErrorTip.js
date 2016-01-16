import React, {Component, PropTypes} from 'react';

class ErrorTip extends Component {
  static propTypes = {
    error: PropTypes.string,
  };

  render() {
    const error = this.props.error;
    return error ? <div className="error-tip"><i className="icon-cuowutishi"></i>{error}</div> : <div></div>;
  }

}

export default ErrorTip;

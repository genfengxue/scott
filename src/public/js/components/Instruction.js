import React, {Component, PropTypes} from 'react';

class Instruction extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className="col-xs-12 instruction">
        <div className="media">
          <div className="media-left">
            <img className="media-object" src="/img/wind.jpg" alt="wind" />
          </div>
          <div className="media-body">
            {this.props.text}
          </div>
        </div>
      </div>
    );
  }

}

export default Instruction;

import React, {Component, PropTypes} from 'react';

class AudioPlayer extends Component {
  static propTypes = {
    audios: PropTypes.array,
    play: PropTypes.bool,
  };

  constructor(props) {
    super();
    this.state = {
      play: props.play,
    }
  }

  render() {
    const play = this.state.play;

    return error ? <div className="error-tip"><i className="icon-cuowutishi"></i>{error}</div> : <div></div>;
  }

}

export default AudioPlayer;

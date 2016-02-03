import React, {Component, PropTypes} from 'react';
import howler from 'howler';

const Howl = howler.Howl;

class AudioPlayer extends Component {
  static propTypes = {
    audios: PropTypes.array.isRequired,
    autoplay: PropTypes.bool,
    children: PropTypes.array,
  };

  constructor(props) {
    super();
    this.state = {
      playing: props.autoplay,
    };
    this.audio = new Howl({
      urls: props.audios,
      autoplay: props.autoplay,
      onend: () => {
        this.state.playing = false;
        this.setState(this.state);
      },
    });
  }

  componentWillUnmount() {
    this.audio.unload();
  }

  togglePlay() {
    this.state.playing = !this.state.playing;
    if (this.state.playing) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
    this.setState(this.state);
  }

  renderDefaultPause() {
    return (
      <div className="audio-btn">
        <i className="icon-pause" />
      </div>
    );
  }

  renderDefaultPlay() {
    return (
      <div className="audio-btn">
        <i className="icon-play" />
      </div>
    );
  }

  render() {
    return (
      <div>
        {
          this.state.playing ?
          <span onClick={this::this.togglePlay}>
            {
              this.props.children && this.props.children[0] ?
              this.props.children[0]
              :
              <div className="audio-btn">
                <i className="icon-pause" />
              </div>
            }
          </span>
          :
          <span onClick={this::this.togglePlay}>
            {
              this.props.children && this.props.children[1] ?
              this.props.children[1]
              :
              <div className="audio-btn">
                <i className="icon-play" />
              </div>
            }
          </span>
        }
      </div>
    );
  }

}

export default AudioPlayer;

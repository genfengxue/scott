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
      loading: true,
    };
    this.audio = new Howl({
      urls: props.audios,
      autoplay: props.autoplay,
      onload: () => {
        this.state.loading = false;
        this.setState(this.state);
      },
      onend: () => {
        this.state.playing = false;
        this.setState(this.state);
      },
      onplay: () => {
        this.state.playing = true;
        this.setState(this.state);
      },
      onpause: () => {
        this.state.playing = false;
        this.setState(this.state);
      },
      onloaderror: (e) => {
        this.state.error = e;
        this.setState(this.state);
      },
    });
  }

  componentWillUnmount() {
    this.audio.unload();
  }

  togglePlay() {
    const playing = !this.state.playing;
    console.log(this.audio);
    if (playing) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  render() {
    return (
      <div>
        {
          this.state.error ?
          <span>
            {
              this.props.children && this.props.children[3] ?
              this.props.children[3]
              :
              <div className="audio-btn">
                <i className="icon-cuowutishi" />
              </div>
            }
          </span>
          :
          this.state.loading ?
          <span>
            {
              this.props.children && this.props.children[2] ?
              this.props.children[2]
              :
              <div className="audio-btn">
                <i className="icon-loading spin" />
              </div>
            }
          </span>
          :
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

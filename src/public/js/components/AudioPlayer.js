import React, {Component, PropTypes} from 'react';
import howler from 'howler';

const Howl = howler.Howl;

class AudioPlayer extends Component {
  static propTypes = {
    audios: PropTypes.array.isRequired,
    autoplay: PropTypes.bool,
    children: PropTypes.array,
  };

  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.audio = new Howl({
      urls: this.props.audios,
      autoplay: this.props.autoplay,
      onload: () => {
        this.state.loading = false;
        console.log('loaded');
        this.setState(this.state);
      },
      onend: () => {
        this.state.playing = false;
        console.log('onend');
        this.setState(this.state);
      },
      onplay: () => {
        this.state.playing = true;
        console.log('onplay');
        this.setState(this.state);
      },
      onpause: () => {
        this.state.playing = false;
        console.log('onpause');
        this.setState(this.state);
      },
      onloaderror: (e) => {
        this.state.error = e;
        console.log(e);
        this.setState(this.state);
      },
    });
  }

  componentWillUnmount() {
    this.audio.unload();
  }


  togglePlay() {
    const playing = !this.state.playing;
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
              this.props.children && this.props.children[2] ?
              this.props.children[2]
              :
              <div className="audio-btn">
                <i className="icon-cuowutishi" />
              </div>
            }
          </span>
          :
          this.state.playing ?
          <span onTouchStart={this::this.togglePlay}>
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
          <span onTouchStart={this::this.togglePlay}>
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

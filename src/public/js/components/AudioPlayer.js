import React, {Component, PropTypes} from 'react';
import howler from 'howler';

const Howl = howler.Howl;

class AudioPlayer extends Component {
  static propTypes = {
    audios: PropTypes.array.isRequired,
    autoplay: PropTypes.bool,
  };

  constructor(props) {
    super();
    this.state = {
      playing: props.autoplay,
    };
    console.log(props.audios);
    this.audio = new Howl({
      urls: props.audios,
      autoplay: props.autoplay,
      onend: () => {
        this.state.playing = false;
        this.setState(this.state);
        console.log('Finished!');
      }
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

  render() {
    return (
      <div>
        {
          this.state.playing ?
          <button className="btn btn-danger btn-o"
            onClick={this::this.togglePlay}>playing</button>
          :
          <button className="btn btn-danger btn-o"
            onClick={this::this.togglePlay}>stopped</button>
        }
      </div>
    );
  }

}

export default AudioPlayer;

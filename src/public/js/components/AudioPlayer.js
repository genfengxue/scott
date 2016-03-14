import React, {Component, PropTypes} from 'react';

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
    const children = this.refs.audio.children;
    const length = children.length;
    let errCount = 0;
    const handler = (err) => {
      errCount++;
      if (errCount === length) {
        console.log('AudioPlayer 24', err);
        this.state.error = err;
        this.setState(this.state);
      }
    };
    for (let i = 0; i < length; i++) {
      const child = children[i];
      child.addEventListener('error', handler);
      child.addEventListener('invalid', handler);
    }
  }

  _onLoaded() {
    this.state.loading = false;
    this.setState(this.state);
  }

  _onEnded() {
    this.state.playing = false;
    this.setState(this.state);
  }

  _onPause() {
    this.state.playing = false;
    this.setState(this.state);
  }

  _onPlay() {
    this.state.playing = true;
    this.setState(this.state);
  }

  _onError(e) {
    this.state.error = e;
    console.log('AudioPlayer 58', e);
    this.setState(this.state);
  }

  togglePlay() {
    const playing = !this.state.playing;
    if (playing) {
      this.refs.audio.play();
    } else {
      this.refs.audio.pause();
    }
  }

  render() {
    const {audios, autoplay} = this.props;
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
        <audio controls
          ref="audio"
          autoPlay={autoplay}
          style={{position: 'fixed', top: '-1000%', left: '-1000%'}}
          className="audio-player-core"
          onPlay={e=>this._onPlay(e)}
          onPause={e => this._onPause(e)}
          onLoaded={e => this._onLoaded(e)}
          onEnded={e=>this._onEnded(e)}
          onError={e=>this._onError(e)}
          >
          {
            audios.map((audio) => {
              const suffix = audio.split('.').reverse()[0];
              return (
                <source
                  src={audio}
                  type={`audio/${suffix === 'mp3' ? 'mpeg' : suffix}`}
                  key={audio}
                  onError={e=>this._onError(e)}
                  />
              );
            })
          }
        </audio>
      </div>
    );
  }

}

export default AudioPlayer;

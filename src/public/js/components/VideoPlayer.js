import React, {Component, PropTypes} from 'react';

class VideoPlayer extends Component {
  static propTypes = {
    videos: PropTypes.array.isRequired,
    autoplay: PropTypes.bool,
    onPlay: PropTypes.func,
  };

  constructor() {
    super();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  _onPlay(e) {
    console.log(e.nativeEvent);
  }

  _onPause(e) {
  }

  render() {
    const videos = this.props.videos;
    return (
      <div className="video-player">
        { videos && videos.length ?
          <video controls
            className="video-player-core"
            onPlay={e=>this._onPlay(e)}
            onPause={e => this._onPlay(e)}
            onLoaded={e => this._onPlay(e)}
            onError={e => this._onPlay(e)}
            onEnded={e => this._onPlay(e)}
            onCanplay={e => this._onPlay(e)}
            >
            {
              videos.map((video) => {
                const suffix = video.split('.').reverse()[0];
                return (
                  <source src={video} type={`video/${suffix}`} key={video} />
                );
              })
            }
            Your browser doesn't support HTML5 video tag.
          </video>
          :
          '无视频源'
        }

      </div>
    );
  }

}

export default VideoPlayer;

import React, {Component, PropTypes} from 'react';

class VideoPlayer extends Component {
  static propTypes = {
    videos: PropTypes.array.isRequired,
    autoplay: PropTypes.bool,
    onPlay: PropTypes.func,
    playing: PropTypes.bool,
  };

  constructor() {
    super();
    wx.getNetworkType({
      success: (res) => {
        this.networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
      },
    });
  }

  componentDidMount() {
    this.refs.video.getDOMNode().setAttribute('webkit-playsinline', 'true');
    if (this.props.playing) {
      this.refs.video.play();
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.playing) {
      this.refs.video.play();
    } else {
      this.refs.video.pause();
    }
  }

  componentWillUnmount() {
  }

  _onPlay(e) {
  }

  _onPause(e) {
  }

  _onCanplay(e) {
    console.dir(e.nativeEvent, this.refs.video);
    this.refs.video.play();
  }
  _onLoaded(e) {
    console.dir(e.nativeEvent, this.refs.video);
    this.refs.video.play();
  }
  render() {
    const videos = this.props.videos;
    return (
      <div className="video-player">
        { videos && videos.length ?
          <video controls
            ref="video"
            className="video-player-core"
            preload="metadata"
            onPlay={e=>this._onPlay(e)}
            onPause={e => this._onPause(e)}
            onLoaded={e => this._onLoaded(e)}
            onCanplay={e => this._onCanplay(e)}
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
        {
          this.networkType === 'wifi' ?
          ''
          :
          '1分钟视频需要约2M流量'
        }
      </div>
    );
  }

}

export default VideoPlayer;

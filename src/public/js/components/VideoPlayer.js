import React, {Component, PropTypes} from 'react';

class VideoPlayer extends Component {
  static propTypes = {
    videos: PropTypes.array.isRequired,
    autoplay: PropTypes.bool,
    onPlay: PropTypes.func,
    playing: PropTypes.bool,
    onEnded: PropTypes.func,
  };

  constructor() {
    super();
    wx.getNetworkType({
      success: (res) => {
        this.networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
      },
      fail: (err) => {
        console.log(err);
      }
    });
  }

  componentDidMount() {
    this.refs.video.setAttribute('webkit-playsinline', 'true');
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
    console.log(e.nativeEvent, this.refs.video);
  }
  _onLoaded(e) {
    console.log(e.nativeEvent, this.refs.video);
  }

  render() {
    const videos = this.props.videos;
    return (
      <div className="video-player">
        { videos && videos.length ?
          <video controls
            ref="video"
            className="video-player-core"
            preload="auto"
            onPlay={e=>this._onPlay(e)}
            onPause={e => this._onPause(e)}
            onLoaded={e => this._onLoaded(e)}
            onCanplay={e => this._onCanplay(e)}
            onEnded={this.props.onEnded}
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
          <div className="text-xs-center">1分钟视频需要约2M流量</div>
        }
      </div>
    );
  }

}

export default VideoPlayer;

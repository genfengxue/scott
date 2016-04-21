import React, {Component, PropTypes} from 'react';
import ajax from '../common/ajax';

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
        console.log('VideoPlayer 19', err);
      },
    });
  }

  componentDidMount() {
    this.refs.video.setAttribute('webkit-playsinline', 'true');
    if (this.props.playing) {
      this.refs.video.play();
    }
    const children = this.refs.video.children;
    const length = children.length;
    let errCount = 0;
    const handler = (err) => {
      errCount++;
      if (errCount === length) {
        ajax.post('/api/behaviors/', {
          scope: 'videoPlayer',
          action: 'fail',
          value: err});
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
    ajax.post('/api/behaviors/', {
      scope: 'videoPlayer',
      action: 'play',
      value: e.target.currentSrc});
  }

  _onPause(e) {
  }

  _onCanplay(e) {
    console.log('VideoPlayer 49', e.nativeEvent, this.refs.video);
  }
  _onLoaded(e) {
    console.log('VideoPlayer 52', e.nativeEvent, this.refs.video);
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

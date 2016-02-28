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
    // console.dir(this.refs.video);
    // const videoEl = this.refs.video;
    // videoEl.oncanplay = () => {
    //   console.log('oncanplay');
    //   videoEl.play();
    // };
  }

  componentWillUnmount() {
  }

  _onPlay(e) {
    console.log(e.nativeEvent);
    e.preventDefault();
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
        3/4G用户请注意视频流量，土豪忽略
      </div>
    );
  }

}

export default VideoPlayer;

import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {actions as homeworkActions} from '../redux/homework';
import {actions as wxsdkActions} from '../redux/wxsdk';
import {Link} from 'react-router';
import ErrorTip from '../components/ErrorTip';
import Header from '../components/Header';
import setTitle from '../common/setTitle';

const mapStateToProps = ({homework, wxsdk}) => ({
  homework, wxsdk,
});

class HomeworkView extends Component {
  static propTypes = {
    params: PropTypes.object,
    fetchSingleHomeworkAsync: PropTypes.func,
    homeworkInit: PropTypes.func,
    homework: PropTypes.object,
    location: PropTypes.object,
    fetchSignatureAsync: PropTypes.func,
    wxsdk: PropTypes.object,
    togglePlay: PropTypes.func,
  };

  constructor(props) {
    super();
    props.homeworkInit();
    console.log(props.params.homeworkId);
    props.fetchSingleHomeworkAsync(props.params.homeworkId);
    props.fetchSignatureAsync();
  }

  play(serverId) {
    wx.downloadVoice({
      serverId: serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success: (res) => {
        this.localId = res.localId; // 返回音频的本地ID
        wx.playVoice({
          localId: this.localId, // 需要播放的音频的本地ID，由stopRecord接口获得
        });
        this.props.togglePlay(true);
        wx.onVoicePlayEnd({
          success: (res) => {
            this.props.togglePlay(false);
          },
        });
      },
    });
  }

  pause() {
    wx.pauseVoice({
      localId: this.localId, // 需要播放的音频的本地ID，由stopRecord接口获得
    });
    this.props.togglePlay(false);
  }

  render() {
    const {homework, wxsdk} = this.props;
    const {serverId, errors, lessonNo, courseNo, nickname, playing} = homework;
    if (!serverId) {
      return <div>Loading...</div>;
    }
    if (serverId) {
      setTitle(` Lesson${lessonNo}-${homework.course.chineseTitle}-作业`);
    }

    return (
      <div className="homework">
        <Header back={`/home/courses/${courseNo}?type=translate`} />
        <div className="container">
          <div className="col-xs-12 video-block">
            <h4>{`${nickname}的翻译作品`}</h4>
            <div className="text-xs-center">
              {
                playing ?
                <i className="icon-pause audio-btn" onClick={() => this.pause()} />
                :
                <i className="icon-play audio-btn" onClick={() => this.play(serverId)} />
              }
            </div>
            <h4>
              本课我一共学习了约{homework.time}分钟
            </h4>
            <p className="text-muted">
              一定要点击微信右上角菜单的分享，分享到微信群，老师才能看到你的作业
            </p>
          </div>
          <ErrorTip error={errors.server} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, Object.assign(homeworkActions, wxsdkActions))(HomeworkView);

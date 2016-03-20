import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {actions as doingHomeworkActions} from '../redux/doingHomework';
import {actions as shiftingActions} from '../redux/shifting';
import {actions as wxsdkActions} from '../redux/wxsdk';
import ErrorTip from '../components/ErrorTip';
import Instruction from '../components/Instruction';
import Header from '../components/Header';
import setTitle from '../common/setTitle';
import CollectionModal from '../components/CollectionModal';
import MethodModal from '../components/MethodModal';
import FeedbackModal from '../components/FeedbackModal';
import ReviewModal from '../components/ReviewModal';
import VideoPlayer from '../components/VideoPlayer';
import {RATES} from '../redux/shifting';

const mapStateToProps = ({doingHomework, shifting, wxsdk}) => ({
  doingHomework, shifting, wxsdk,
});

class DoingHomeworkView extends Component {
  static propTypes = {
    params: PropTypes.object,
    fetchSingleLessonAsync: PropTypes.func,
    toggleCollectionModal: PropTypes.func,
    toggleSpeeds: PropTypes.func,
    toggleMethodModal: PropTypes.func,
    toggleFeedbackModal: PropTypes.func,
    toggleReviewModal: PropTypes.func,
    shiftSpeed: PropTypes.func,
    doingHomeworkInit: PropTypes.func,
    doingHomework: PropTypes.object,
    shifting: PropTypes.object,
    location: PropTypes.object,
    beginTranslateQuiz: PropTypes.func,
    fetchSignatureAsync: PropTypes.func,
    wxsdk: PropTypes.object,
    cancelSubmit: PropTypes.func,
    submitRecordAsync: PropTypes.func,
    endTranslateQuizAsync: PropTypes.func,
    endQuiz: PropTypes.func,
  };

  constructor(props) {
    super();
    props.doingHomeworkInit();
    props.fetchSingleLessonAsync(props.params.courseNo, props.params.lessonNo);
    props.fetchSignatureAsync();
    this.localIds = [];
  }

  componentWillUpdate(nextProps) {
    if (nextProps.params.lessonNo !== this.props.params.lessonNo || nextProps.params.courseNo !== this.props.params.courseNo) {
      this.props.fetchSingleLessonAsync(nextProps.params.courseNo, nextProps.params.lessonNo);
      this.props.doingHomeworkInit();
    }
  }

  componentWillUnmount() {
    if (this.endTimeout) {
      clearTimeout(this.endTimeout);
    }
  }

  stopRecord() {
    wx.stopRecord({
      success: (res) => {
        this.localIds.push(res.localId);
        // todo: end quiz
        this.props.endQuiz(this.localIds);
        this.props.endTranslateQuizAsync(this.localIds.slice());
      },
      fail: (err) => {
        console.log('views/DoingHomeworkView 75', err);
      },
    });
  }

  submit(data) {
    const nickname = this.refs.nickname.value;
    const time = parseInt(this.refs.time.value, 10);
    const payload = Object.assign(data, {nickname, time});
    this.props.submitRecordAsync(payload, this.props.wxsdk);
  }

  beginTranslateQuiz() {
    setTimeout(() => this.props.beginTranslateQuiz(), 500);
    wx.startRecord();
    wx.onVoiceRecordEnd({
    // 录音时间超过一分钟没有停止的时候会执行 complete 回调
      complete: (res) => {
        this.localIds.push(res.localId);
        // todo: start another record
        wx.startRecord();
        setTimeout(() => this.props.beginTranslateQuiz(), 500);
      },
      fail: (err) => {
        console.log('views/DoingHomeworkView 100', err);
      },
    });
  }

  rework() {
    location.reload();
  }

  render() {
    const {doingHomework, shifting, wxsdk} = this.props;
    // const {errMsg} = wxsdk;
    // if (errMsg) {
    //   console.log('签名失败');
    // }
    const {lesson, quizOn, errors, showCollectionModal, showMethodModal, showReviewModal, showFeedbackModal, localIds, time} = doingHomework;
    const {courseNo, lessonNo} = this.props.params;
    const {query} = this.props.location;
    const type = query.type || 'listen';
    if (!lesson) {
      return <div>Loading...</div>;
    }
    if (lesson) {
      setTitle(`打Boss`);
    }

    // videos
    let videos;
    /**
     * Get the rated audio source according to original src and rate.
     * @param {String} src: original src
     * @param {String} rate: the rate, '0.8', '1.0'
     */
    const getRatedVideoSrc = (src, rate) => {
      const suffix = '.mp4';
      const rateSrc = rate.toString().replace('.', '_');
      let result = src;
      result = result + '@' + rateSrc + suffix;
      const suffixes = ['.mp4'];
      return suffixes.map((x) => {
        return result.substr(0, result.length - suffix.length) + x;
      });
    };
    if (lesson && lesson.videoPath) {
      videos = getRatedVideoSrc(lesson.videoPath + (type === 'translate' ? '_muted' : ''), shifting.speed);
    }

    return (
      <div className="translate">
        <Header back={`/home/courses/${courseNo}?type=${type}`}>
          <a className="nav-link" onClick={() => this.props.toggleMethodModal(true)} >方法</a>
          <a className="nav-link" onClick={e => {
            e.stopPropagation();
            this.props.toggleSpeeds();
          }}>难度</a>
          {
            shifting.showSpeeds ?
            <div>
              {
                RATES.map((rate) => {
                  return (
                    <a className={'nav-link col-xs-12' + (shifting.speed === rate ? ' selected' : '')} key={rate} onClick={() => {
                      this.props.shiftSpeed(rate);
                    }}>
                      {rate}
                      {
                        shifting.speed === rate ?
                        <i className="icon-tick pull-xs-right" />
                        :
                        ''
                      }
                    </a>
                  );
                })
              }
            </div>
            :
            ''
          }
          <a className="nav-link" onClick={() => this.props.toggleCollectionModal(true)} >存档</a>
          <a className="nav-link" onClick={() => this.props.toggleReviewModal(true)} >复习</a>
          <a className="nav-link" onClick={() => this.props.toggleFeedbackModal(true)} >纠错</a>
        </Header>
        <CollectionModal
          isOpen={showCollectionModal}
          onRequestClose={() => this.props.toggleCollectionModal(false)} />
        <MethodModal
          isOpen={showMethodModal}
          onRequestClose={() => this.props.toggleMethodModal(false)} />
        <ReviewModal
          isOpen={showReviewModal}
          onRequestClose={() => this.props.toggleReviewModal(false)} />
        <FeedbackModal
          isOpen={showFeedbackModal}
          onRequestClose={() => this.props.toggleFeedbackModal(false)} />
        <div className="container">
          {
            localIds ?
            <Instruction text="请提交录音" />
            :
            <Instruction text={`请${type === 'translate' ? '翻译' : '跟读'}整段视频`} />
          }

          <div className="col-xs-12 video-block">
            {
              localIds ?
              <div>
                <div className="form-group row">
                  <label htmlFor="nickname" className="col-xs-3 form-control-label">昵称</label>
                  <div className="col-xs-6">
                    <input type="text" ref="nickname" className="form-control" id="nickname" placeholder="请输入英文名" />
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-6 col-xs-offset-3">
                    <ErrorTip error={errors.nickname} />
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="time" className="col-xs-3 form-control-label">时间</label>
                  <div className="col-xs-6">
                    <input ref="time" defaultValue={parseInt(time / 1000 / 60, 10)} type="number" className="form-control" id="time" placeholder="时间" pattern="[0-9]*"/>
                  </div>
                  <label className="col-xs-3 form-control-label">分钟</label>
                </div>
                <div className="row">
                  <div className="col-xs-6 col-xs-offset-3">
                    <ErrorTip error={errors.time} />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-xs-6 col-xs-offset-3 small">
                    这是系统记录你本课的学习时间，可以手动修改
                  </div>
                </div>
              </div>
              :
              <div>
                <VideoPlayer playing={quizOn} videos={videos} key={videos[0]} />
                {
                  quizOn ?
                  <p className="text-danger text-xs-center">正在录音中...</p>
                  :
                  <p> </p>
                }
                {
                  quizOn ?
                  <p className="small">如果视频没自动播放, 请手动播放视频;<br />如果字幕被播放器挡住, 请点击一下空白区域即可</p>
                  :
                  ''
                }
              </div>
            }
          </div>
          <ErrorTip error={errors.server} />
        </div>
        <nav className="navbar navbar-fixed-bottom bottom-nav">
          <ul className="nav navbar-nav">
            <li className="col-xs-1 no-padding-col">
            {
              localIds ?
              <a className="nav-link" onClick={this.props.cancelSubmit}>
                <i className="icon-left" />
              </a>
              :
              ''
            }
            </li>
            {
              localIds ?
              <li className="col-xs-10 text-xs-center">
                <a className="bottom-nav-btn btn btn-primary-outline col-xs-12" onClick={() => this.submit({courseNo, lessonNo, localIds, type})}>
                  提交录音
                </a>
              </li>
              :
              <li className="col-xs-10 text-xs-center">
                {
                  quizOn ?
                  <div>
                    <a className="bottom-nav-btn btn btn-primary-outline col-xs-12" onClick={() => this.stopRecord()}>
                      完成录音
                    </a>
                    <a className="bottom-nav-btn btn btn-link col-xs-12" style={{'marginTop': '0.5rem'}} onClick={() => this.rework()}>
                      重新打Boss
                    </a>
                  </div>
                  :
                  wxsdk.signature ?
                  <a className="bottom-nav-btn btn btn-primary-outline col-xs-12" onClick={() => this.beginTranslateQuiz()}>
                    立即开始
                  </a>
                  :
                  wxsdk.errMsg ?
                  <div>
                    <p>
                      Boss没准备好，请重来一遍
                    </p>
                    <a className="bottom-nav-btn btn btn-primary-outline col-xs-12" onClick={this.props.fetchSignatureAsync}>
                      Boss快粗来
                    </a>
                  </div>
                  :
                  wxsdk.noWechat ?
                  <div className="small">
                    录音功能不支持在浏览器下使用, 请用微信
                  </div>
                  :
                  <div>
                    <h3>
                      <i className="icon-loadingdots spin"/>
                    </h3>
                    Boss正在准备中，请稍后
                  </div>
                }
              </li>
            }
          </ul>
        </nav>
      </div>
    );
  }
}

export default connect(mapStateToProps, Object.assign(doingHomeworkActions, shiftingActions, wxsdkActions))(DoingHomeworkView);

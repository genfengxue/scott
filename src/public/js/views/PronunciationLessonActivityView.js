import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {actions} from '../redux/pronunciationLessonActivity';
import {actions as wxsdkActions} from '../redux/wxsdk';
import {Link} from 'react-router';
import Slider from 'react-slick';
import Progress from 'react-progress';
import Instruction from '../components/Instruction';
import AudioPlayer from '../components/AudioPlayer';
import VideoPlayer from '../components/VideoPlayer';
import ErrorTip from '../components/ErrorTip';
import ScrollingView from '../components/ScrollingView';
import history from '../common/history';
import setTitle from '../common/setTitle';

const mapStateToProps = ({pronunciationLessonActivity, wxsdk}) => ({
  pronunciationLessonActivity, wxsdk,
});

class PronunciationLessonActivityView extends Component {

  static propTypes = {
    params: PropTypes.object,
    pronunciationLessonActivity: PropTypes.object.isRequired,
    wxsdk: PropTypes.object.isRequired,
    fetchPronunciationLessonsActivityAsync: PropTypes.func.isRequired,
    fetchSignatureAsync: PropTypes.func.isRequired,
    beginRecord: PropTypes.func.isRequired,
    endRecord: PropTypes.func.isRequired,
    endPronunciationHomeworkAsync: PropTypes.func.isRequired,
    submitRecordAsync: PropTypes.func.isRequired,
    pronunciationLessonActivityInit: PropTypes.func.isRequired,
    clearRecords: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.localIds = [];
    props.pronunciationLessonActivityInit();
    // the react-slick sucks!
    const {courseNo, lessonNo, activityIndex} = props.params;
    if (activityIndex) {
      history.pushState(null, `/home/pronunciation_courses/${courseNo}/lessons/${lessonNo}/0`);
      setTimeout(() => history.pushState(null, `/home/pronunciation_courses/${courseNo}/lessons/${lessonNo}/${activityIndex}`), 200);
    }
  }

  componentDidMount() {
    this.props.fetchPronunciationLessonsActivityAsync(this.props.params.courseNo, this.props.params.lessonNo);
    this.props.fetchSignatureAsync();
    this.forceUpdate();
  }

  beginRecord() {
    this.props.beginRecord();
    wx.startRecord();
    wx.onVoiceRecordEnd({
    // 录音时间超过一分钟没有停止的时候会执行 complete 回调
      complete: (res) => {
        this.localIds.push(res.localId);
        // todo: start another record
        wx.startRecord();
      },
      fail: (err) => {
        console.error('views/DoingHomeworkView 100', err.toString());
      },
    });
  }

  endRecord() {
    wx.stopRecord({
      success: (res) => {
        this.localIds.push(res.localId);
        // todo: end quiz
        this.props.endRecord(this.localIds);
        this.props.endPronunciationHomeworkAsync(this.localIds.slice());
      },
      fail: (err) => {
        console.log('views/DoingHomeworkView 75', err);
      },
    });
  }

  rework() {
    this.localIds = [];
    this.props.clearRecords();
  }

  submit(data) {
    const nickname = this.refs.nickname.value;
    const time = parseInt(this.refs.time.value, 10);
    const payload = Object.assign(data, {nickname, time});
    this.props.submitRecordAsync(payload);
  }

  renderPrevArrow(courseNo, lessonNo, activityIndex) {
    if (activityIndex === 0) {
      return '';
    }
    return (
      <div className="slick-prev">
        <Link to={`/home/pronunciation_courses/${courseNo}/lessons/${lessonNo}/${activityIndex - 1}`} className="prev-button" />
      </div>
    );
  }

  renderNextArrow(courseNo, lessonNo, activityIndex) {
    const {pronunciationLessonActivity} = this.props;
    if (activityIndex + 1 === pronunciationLessonActivity.docs.length) {
      return (
        <div className="slick-next"><a className="next-button hidden"></a></div>
      );
    }
    return (
      <div className="slick-next">
        <Link to={`/home/pronunciation_courses/${courseNo}/lessons/${lessonNo}/${activityIndex + 1}`} className="next-button" />
      </div>
    );
  }

  render() {
    const {pronunciationLessonActivity, wxsdk} = this.props;
    const {docs, recording, localIds, lesson, errors, time} = pronunciationLessonActivity;
    let {activityIndex} = this.props.params;
    if (!activityIndex) {
      activityIndex = 0;
    } else {
      activityIndex = +activityIndex;
    }
    if (!lesson) {
      return <div>loading</div>;
    }
    const {lessonNo, courseNo} = lesson;
    // Set the current progress
    const activitiesCount = docs.length;
    const currentProgress = ((activityIndex || 0) + 1) / activitiesCount * 100;
    const activityLessonActivity = docs[activityIndex || 0];
    const settings = {
      dots: false,
      swipe: false,
      infinite: false,
      arrows: false,
      afterChange: (index) => {
        history.pushState(null, `/home/pronunciation_courses/${courseNo}/lessons/${lessonNo}/${index}`);
        // why need this? the action does not fire render...
      },
      slickGoTo: activityIndex,
    };

    const scrollStyle = {
      overflowY: 'auto',
      height: (window.innerHeight - 19 * parseFloat(window.getComputedStyle(document.body, null).getPropertyValue('font-size'))) + 'px',
      'WebkitOverflowScrolling': 'touch',
    };
    setTitle(`${(activityIndex || 0) + 1}/${activitiesCount} ${lesson.englishTitle}`);
    return (
      <div className="pronunciation-activity-view clearfix">
        <nav className="navbar">
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to={`/home/pronunciation_courses/${lesson.courseNo}/lessons/`}>
                <i className="icon-left" />
              </Link>
            </li>
          </ul>
        </nav>

        <div className="col-xs-12">
          <div className="progress-bar">
            <Progress percent={currentProgress}/>
          </div>

          <Slider {...settings}>
            {docs.map((lessonActivity, index) => {
              const shouldShow = index >= activityIndex - 1 && index <= activityIndex + 1;
              const active = index === activityIndex;
              return (
                <div key={lessonActivity.index}>
                  {() => {
                    if (lessonActivity.type === '讲解' && shouldShow) {
                      return (
                        <div className="activity-item">
                          <div className="clearfix">
                          <Instruction text="请听讲解" />
                          </div>
                          <ScrollingView className="course-content" style={scrollStyle}>
                            {
                              lessonActivity.video && active
                                ? <VideoPlayer videos={[lessonActivity.video]} autoplay key={lessonActivity.video} />
                                : ''
                            }
                            <div className="listen-explain">
                              <div dangerouslySetInnerHTML={{__html: lessonActivity.description}}></div>
                            </div>
                            {
                              lessonActivity.audio && active
                                ? <AudioPlayer audios={[lessonActivity.audio]} autoplay key={lessonActivity.audio}>
                                    <div className="sentence-text">
                                      <i className="icon-voice"></i>
                                    </div>
                                    <div className="sentence-text">
                                      <i className="icon-voice-mute" />
                                    </div>
                                    <div className="sentence-text">
                                      出错啦！
                                    </div>
                                  </AudioPlayer>
                                : ''
                            }
                          </ScrollingView>
                        </div>
                      );
                    }
                  }()}

                  {() => {
                    if (lessonActivity.type === '朗读' && shouldShow) {
                      return (
                        <div className="activity-item">
                          <div className="clearfix">
                          <Instruction text="请朗读" />
                          </div>
                          <ScrollingView className="course-content" style={scrollStyle}>
                            <div className="reading-pronunciation">
                              <div className="text-xs-center">
                              {
                                lessonActivity.readingText
                              }
                              </div>
                              <div className="text-muted text-xs-center">
                              {
                                lessonActivity.readingNote
                              }
                                <div style={{display: 'inline-block'}}>
                                {
                                  lessonActivity.audio && active
                                  ? <AudioPlayer audios={[lessonActivity.audio]} autoplay key={lessonActivity.audio}>
                                      <div className="sentence-text">
                                        <i className="icon-voice"></i>
                                      </div>
                                      <div className="sentence-text">
                                        <i className="icon-voice-mute" />
                                      </div>
                                      <div className="sentence-text">
                                        出错啦！
                                      </div>
                                    </AudioPlayer>
                                  : ''
                                }
                                </div>
                              </div>
                            </div>
                          </ScrollingView>
                        </div>
                      );
                    }
                  }()}

                  {() => {
                    if (lessonActivity.type === '打Boss' && shouldShow) {
                      return (
                        <div className="activity-item">
                          <div className="clearfix">
                            {
                              localIds ?
                              <Instruction text="请提交录音" />
                              :
                              <Instruction text="请朗读整段文本" />
                            }
                          </div>
                          {
                            localIds ?
                            <div className="col-xs-12">
                              <div className="form-group row">
                                <label htmlFor="nickname" className="col-xs-3 form-control-label">昵称</label>
                                <div className="col-xs-6">
                                  <input type="text" ref="nickname" className="form-control" id="nickname" placeholder="请输入英文名" />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-xs-6 col-xs-offset-3">
                                  <ErrorTip error={errors && errors.nickname} />
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
                                  <ErrorTip error={errors && errors.time} />
                                </div>
                              </div>
                              <div className="form-group row">
                                <div className="col-xs-6 col-xs-offset-3 small">
                                  这是系统记录你本课的学习时间，可以手动修改
                                </div>
                              </div>
                              <ErrorTip error={errors && errors.server} />
                            </div>
                            :
                            <ScrollingView className="course-content" style={scrollStyle}>
                              <div className="reading-pronunciation">
                                <div dangerouslySetInnerHTML={{__html: lessonActivity.description}}></div>
                              </div>
                              {
                                lessonActivity.audio && active
                                ? <AudioPlayer audios={[lessonActivity.audio]} key={lessonActivity.audio}>
                                    <div className="sentence-text">
                                      <i className="icon-voice"></i>
                                    </div>
                                    <div className="sentence-text">
                                      <i className="icon-voice-mute" />
                                    </div>
                                    <div className="sentence-text">
                                      出错啦！
                                    </div>
                                  </AudioPlayer>
                                : ''
                              }
                            </ScrollingView>
                          }
                        </div>
                      );
                    }
                  }()}
                </div>
              );
            })}
          </Slider>
        </div>

        <div className="course-buttons">
          <div className="col-xs-4 text-xs-center">
            {this.renderPrevArrow(courseNo, lessonNo, activityIndex)}
          </div>
          <div className="col-xs-4 text-xs-center no-padding-col">
            {
              activityIndex + 1 === pronunciationLessonActivity.docs.length && activityLessonActivity.type === '打Boss' ?
              <div>
                {
                  localIds ?
                  <div>
                    <a className="action-button submit-button" onClick={e => this.submit({lessonActivityId:activityLessonActivity._id, localIds})}>
                      提交
                    </a>
                    <a className="action-button rework-button" onClick={e => this.rework(e)}>
                      重来
                    </a>
                  </div>
                  :
                  recording ?
                  <a className="action-button record-button recording" onClick={e => this.endRecord(e)}>
                    <i className="icon-mic" />
                  </a>
                  :
                  wxsdk.signature ?
                  <a className="action-button record-button" onClick={e => this.beginRecord(e)}>
                    <i className="icon-mic" />
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
              </div>
              : ''
            }
            {this.renderNextArrow(courseNo, lessonNo, activityIndex)}
            <span className="submit-button hidden"></span>
            <span className="upload-button hidden"></span>
          </div>
          <div className="col-xs-4 text-xs-center">
            {
              activityIndex + 1 !== pronunciationLessonActivity.docs.length ?
              <Link className="boss-button pull-xs-right" to={`/home/pronunciation_courses/${courseNo}/lessons/${lessonNo}/${pronunciationLessonActivity.docs.length - 1}`} />
              :
              ''
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, Object.assign(actions, wxsdkActions))(PronunciationLessonActivityView);

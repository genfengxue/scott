import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {actions as doingNewhomeworkActions} from '../redux/doingNewhomework';
import {actions as shiftingActions} from '../redux/shifting';
import ErrorTip from '../components/ErrorTip';
import Instruction from '../components/Instruction';
import Header from '../components/Header';
import setTitle from '../common/setTitle';
import CollectionModal from '../components/CollectionModal';
import MethodModal from '../components/MethodModal';
import FeedbackModal from '../components/FeedbackModal';
import ReviewModal from '../components/ReviewModal';
import AnswerModal from '../components/AnswerModal';
import {RATES} from '../redux/shifting';
import {Link} from 'react-router';

const mapStateToProps = ({doingNewhomework, shifting}) => ({
  doingNewhomework, shifting,
});

class DoingNewhomeworkView extends Component {
  static propTypes = {
    params: PropTypes.object,
    fetchSingleLessonAsync: PropTypes.func,
    toggleCollectionModal: PropTypes.func,
    toggleSpeeds: PropTypes.func,
    toggleMethodModal: PropTypes.func,
    toggleFeedbackModal: PropTypes.func,
    toggleReviewModal: PropTypes.func,
    shiftSpeed: PropTypes.func,
    doingNewhomeworkInit: PropTypes.func,
    doingNewhomework: PropTypes.object,
    shifting: PropTypes.object,
    location: PropTypes.object,
    beginTranslateQuiz: PropTypes.func,
    cancelSubmit: PropTypes.func,
    submitRecordAsync: PropTypes.func,
    endTranslateQuizAsync: PropTypes.func,
    endQuiz: PropTypes.func,
    toggleAnswerModal: PropTypes.func,
    history: PropTypes.object,
  };

  constructor(props) {
    super();
    props.doingNewhomeworkInit();
    props.fetchSingleLessonAsync(props.params.courseNo, props.params.lessonNo);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.params.lessonNo !== this.props.params.lessonNo || nextProps.params.courseNo !== this.props.params.courseNo) {
      this.props.fetchSingleLessonAsync(nextProps.params.courseNo, nextProps.params.lessonNo);
      this.props.doingNewhomeworkInit();
    }
  }

  componentWillUnmount() {
  }

  render() {
    const {doingNewhomework, shifting} = this.props;
    const {lesson, errors, showCollectionModal, showMethodModal, showReviewModal, showFeedbackModal, showAnswerModal} = doingNewhomework;
    const {courseNo, lessonNo} = this.props.params;
    const {query} = this.props.location;
    const type = query.type || 'listen';
    if (!lesson) {
      return <div>Loading...</div>;
    }
    if (lesson) {
      setTitle(`打Boss ${lesson.englishTitle}`);
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
          <Link className="nav-link"
            to={`/home/courses/${courseNo}/lessons/${lessonNo}/quiz/?type=${type}`}>
            打Boss
          </Link>
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
        <AnswerModal
          isOpen={showAnswerModal}
          title="答案公布"
          onRequestClose={() => this.props.toggleAnswerModal(false)}>
          <div dangerouslySetInnerHTML={{__html: lesson.homeworkAnswer}}>
          </div>
        </AnswerModal>
        <div className="container">
          <div className="clearfix">
            <Instruction text={type === 'translate' ? '请翻译下边句子' : '请完成本课听力测验'} />
          </div>
          {
            type === 'translate' ?
            <div className="clearfix" style={{'paddingTop': '2rem'}}>
              <div className="clearfix">
                {
                  lesson.homeworkTxt ?
                  <textarea
                    className="col-xs-12"
                    value={lesson.homeworkTxt}
                    style={{
                      overflowY: 'scroll',
                      height: (window.innerHeight - 19 * parseFloat(window.getComputedStyle(document.body, null).getPropertyValue('font-size'))) + 'px'}}>
                  </textarea>
                  :
                  <div className="text-xs-center text-muted">
                    暂无测验
                  </div>
                }
              </div>
            </div>
            :
            <div className="clearfix" style={{'paddingTop': '10rem'}}>
              <div className="clearfix">
              {
                lesson.homeworkLink ?
                <a className="btn btn-primary-outline col-xs-10 col-xs-offset-1" href={lesson.homeworkLink}>
                  开始测验
                </a>
                :
                <a className="btn btn-secondary col-xs-10 col-xs-offset-1">
                  暂无测验
                </a>
              }
              </div>
            </div>
          }
          <ErrorTip error={errors.server} />
        </div>
        <nav className="navbar navbar-fixed-bottom bottom-nav">
          <ul className="nav navbar-nav">
            <li className="col-xs-1 no-padding-col" style={{'marginTop': '4.4rem'}}>
              <a className="nav-link" >
                <i className="icon-left" onClick={() => this.props.history.goBack()}/>
              </a>
            </li>
            <li className="col-xs-10 text-xs-center">
              {
                type === 'translate' ?
                <div className="clearfix">
                  <div className="text-muted text-xs-center">
                    请长按上边句子，粘贴到微信群，<br />
                    然后录音提交作业<br />
                    跟读整段视频练习隐藏在<i style={{'verticalAlign': 'bottom'}} className="icon-hamburger text-primary" />中
                  </div>
                  <a className="bottom-nav-btn btn btn-primary-outline col-xs-12"
                    onClick={() => this.props.toggleAnswerModal(true)}>
                    查看答案
                  </a>
                </div>
                :
                <div className="nav-link text-muted text-xs-center">
                  跟读整段视频练习隐藏在<i style={{'verticalAlign': 'bottom'}} className="icon-hamburger text-primary" />中
                </div>
              }
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default connect(mapStateToProps, Object.assign(doingNewhomeworkActions, shiftingActions))(DoingNewhomeworkView);

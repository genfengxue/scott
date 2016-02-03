import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import { Provider, connect } from 'react-redux';
import {actions as listenActions} from '../redux/listen';
import {actions as sentencesActions} from '../redux/sentences';
import {Link} from 'react-router';
import ErrorTip from '../components/ErrorTip';
import AudioPlayer from '../components/AudioPlayer';
import Instruction from '../components/Instruction';

const mapStateToProps = ({listen, sentences}) => ({
  listen, sentences
});

class ListenView extends Component {
  static propTypes = {
    params: PropTypes.object,
    fetchSentencesAsync: PropTypes.func,
    showListenAnswer: PropTypes.func,
  };

  constructor(props) {
    super();
    props.fetchSentencesAsync(props.params.courseNo, props.params.lessonNo);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.params.lessonNo !== this.props.params.lessonNo || nextProps.params.courseNo !== this.props.params.courseNo) {
      this.props.fetchSentencesAsync(nextProps.params.courseNo, nextProps.params.lessonNo);
      this.props.listenInit();
    }
    if (nextProps.params.sentenceNo !== this.props.params.sentenceNo) {
      this.props.listenInit();
    }
  }

  render() {
    const course = this.props.sentences.course;
    const lesson = this.props.sentences.lesson;
    if (course && lesson) {
      document.title = `听力-Lesson${lesson.lessonNo}-${course.chineseTitle}`;
    }
    const {listen, sentences} = this.props;
    const {errors, viewAnswer} = listen;
    const {courseNo, lessonNo, sentenceNo} = this.props.params;
    const sentence =  sentences.docs.filter((sentence) => {
      return +sentence.sentenceNo === +this.props.params.sentenceNo;
    })[0];
    if (!sentence) {
      return <div>Loading...</div>;
    }

    // get prev next pointer
    const prevSentence = sentences.docs.filter((x) => {
      return x.sentenceNo < +sentenceNo && x.audio && x.audio.length;
    }).reverse()[0];
    const nextSentence = sentences.docs.filter((x) => {
      return x.sentenceNo > +sentenceNo && x.audio && x.audio.length;
    })[0];
    const prevId = prevSentence ? prevSentence.sentenceNo : 0;
    const nextId = nextSentence ? nextSentence.sentenceNo : 0;
    return (
      <div className="listen">
        <nav className="navbar">
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to={`/home/courses/${courseNo}`}>
                <i className="icon-left" />
              </Link>
            </li>
          </ul>
        </nav>
        <div className="container">
          <Instruction text="请跟读" />
          <div className="answer-block text-xs-center">
            {
              viewAnswer ?
              (
                sentence.audio ?
                <AudioPlayer audios={[sentence.audio]} autoplay={true}>
                  <div>{sentence.english} <i className="icon-voice" style={{'verticalAlign': 'middle'}}/></div>
                  <div>{sentence.english} <i className="icon-voice" style={{'verticalAlign': 'middle'}}/></div>
                </AudioPlayer>
                : ''
              )
              :
              (
                sentence.audio ?
                <AudioPlayer audios={[sentence.audio]} autoplay={true}>
                  <div className="audio-btn">
                    <i className="icon-pause" />
                  </div>
                  <div className="audio-btn">
                    <i className="icon-play" />
                  </div>
                </AudioPlayer>
                : ''
              )
            }
          </div>
          <div>
            {
              prevId ?
              <Link to={`/home/courses/${courseNo}/lessons/${lessonNo}/listen/${prevId}`}
                className="pull-left nav-btn">
                <i className="icon-left" />
              </Link> :
              ''
            }
            {
              nextId ?
              <Link to={`/home/courses/${courseNo}/lessons/${lessonNo}/listen/${nextId}`}
                className="pull-right nav-btn">
                <i className="icon-right" />
              </Link> :
              ''
            }
          </div>
          <ErrorTip error={errors.server} />
        </div>
        <nav className="navbar navbar-fixed-bottom bottom-nav">
          <ul className="nav navbar-nav">
            <li className="col-xs-2">
              {
                prevId ?
                <Link className="nav-link" to={`/home/courses/${courseNo}/lessons/${lessonNo}/listen/${prevId}`}>
                  <i className="icon-left" />
                </Link>
                :
                ''
              }
            </li>
            <li className="col-xs-8 text-xs-center">
            {
              viewAnswer ?
              (
                nextId ?
                <Link className="btn btn-primary-outline col-xs-12" to={`/home/courses/${courseNo}/lessons/${lessonNo}/listen/${nextId}`}>
                  下一句
                </Link>
                : '没了'
              )
              :
              <button className="btn btn-primary-outline col-xs-12" onClick={this.props.showListenAnswer}>
                查看答案
              </button>
            }
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default connect(mapStateToProps, Object.assign(listenActions, sentencesActions))(ListenView);

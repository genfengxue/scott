import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {actions as listenActions} from '../redux/listen';
import {actions as sentencesActions} from '../redux/sentences';
import {Link} from 'react-router';
import ErrorTip from '../components/ErrorTip';
import AudioPlayer from '../components/AudioPlayer';
import Instruction from '../components/Instruction';
import setTitle from '../common/setTitle';

const mapStateToProps = ({listen, sentences}) => ({
  listen, sentences,
});

class ListenView extends Component {
  static propTypes = {
    params: PropTypes.object,
    fetchSentencesAsync: PropTypes.func,
    showListenAnswer: PropTypes.func,
    listenInit: PropTypes.func,
    sentences: PropTypes.object,
    listen: PropTypes.object,
  };

  constructor(props) {
    super();
    props.listenInit();
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
    const {listen, sentences} = this.props;
    const {errors, viewAnswer} = listen;
    const {courseNo, lessonNo, sentenceNo} = this.props.params;
    const sentence = sentences.docs.filter((x) => {
      return +x.sentenceNo === +this.props.params.sentenceNo;
    })[0];
    if (!sentence) {
      return <div>Loading...</div>;
    }
    if (course && lesson && sentence) {
      setTitle(`共${sentences.docs.length}句-Lesson${lesson.lessonNo}-${course.chineseTitle}`);
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
      <div className="listen noselect">
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
          <div className="col-xs-12 answer-block">
            <div className="center-block">
            {
              () => {
                switch (true) {
                case viewAnswer && !!sentence.audio:
                  return (
                    <div>
                      <AudioPlayer audios={[sentence.audio]} autoplay key={sentence._id}>
                        <div className="sentence-text">
                          {sentence.sentenceNo} {sentence.english} <i className="icon-voice" />
                          <br />
                          <span className="hidden">{sentence.sentenceNo} </span><small>{sentence.chinese}</small>
                        </div>
                        <div className="sentence-text">
                          {sentence.sentenceNo} {sentence.english} <i className="icon-voice-mute" />
                          <br />
                          <span className="hidden">{sentence.sentenceNo} </span><small>{sentence.chinese}</small>
                        </div>
                        <div className="sentence-text">
                          {sentence.sentenceNo} {sentence.english} <i className="icon-loading spin" />
                          <br />
                          <span className="hidden">{sentence.sentenceNo} </span><small>{sentence.chinese}</small>
                        </div>
                        <div className="sentence-text">
                          {sentence.sentenceNo} {sentence.english}
                          <br />
                          <span className="hidden">{sentence.sentenceNo} </span><small>{sentence.chinese}</small>
                        </div>
                      </AudioPlayer>
                    </div>
                  );
                case !viewAnswer && !!sentence.audio:
                  return (
                    <div className="text-xs-center">
                      <AudioPlayer audios={[sentence.audio]} autoplay key={sentence._id}>
                        <div className="audio-btn">
                          <i className="icon-pause" />
                        </div>
                        <div className="audio-btn">
                          <i className="icon-play" />
                        </div>
                      </AudioPlayer>
                    </div>
                  );
                default:
                  return '';
                }
              }()
            }
            </div>
          </div>
          <ErrorTip error={errors.server} />
        </div>
        <nav className="navbar navbar-fixed-bottom bottom-nav">
          <ul className="nav navbar-nav">
            <li className="col-xs-1 no-padding-col">
            {
              prevId ?
              <Link className="nav-link" to={`/home/courses/${courseNo}/lessons/${lessonNo}/listen/${prevId}`}>
                <i className="icon-left" />
              </Link>
              :
              ''
            }
            </li>
            <li className="col-xs-10 text-xs-center">
            {
              viewAnswer ?
              (
                nextId ?
                <Link className="bottom-nav-btn btn btn-primary-outline col-xs-12" to={`/home/courses/${courseNo}/lessons/${lessonNo}/listen/${nextId}`}>
                  下一句
                </Link>
                :
                <Link className="bottom-nav-btn btn btn-primary-outline col-xs-12" to={`/home/courses/${courseNo}/lessons/${lessonNo}/listen/1`}>
                  再来一遍
                </Link>
              )
              :
              <button className="bottom-nav-btn btn btn-primary-outline col-xs-12" onClick={this.props.showListenAnswer}>
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

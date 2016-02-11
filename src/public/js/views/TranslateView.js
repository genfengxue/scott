import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {actions as translateActions} from '../redux/translate';
import {actions as sentencesActions} from '../redux/sentences';
import {Link} from 'react-router';
import ErrorTip from '../components/ErrorTip';
import AudioPlayer from '../components/AudioPlayer';
import Instruction from '../components/Instruction';
import setTitle from '../common/setTitle';

const mapStateToProps = ({translate, sentences}) => ({
  translate, sentences,
});

class TranslateView extends Component {
  static propTypes = {
    params: PropTypes.object,
    fetchSentencesAsync: PropTypes.func,
    showTranslateAnswer: PropTypes.func,
    translateInit: PropTypes.func,
    sentences: PropTypes.object,
    translate: PropTypes.object,
  };

  constructor(props) {
    super();
    props.fetchSentencesAsync(props.params.courseNo, props.params.lessonNo);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.params.lessonNo !== this.props.params.lessonNo || nextProps.params.courseNo !== this.props.params.courseNo) {
      this.props.fetchSentencesAsync(nextProps.params.courseNo, nextProps.params.lessonNo);
      this.props.translateInit();
    }
    if (nextProps.params.sentenceNo !== this.props.params.sentenceNo) {
      this.props.translateInit();
    }
  }

  render() {
    const course = this.props.sentences.course;
    const lesson = this.props.sentences.lesson;
    const {translate, sentences} = this.props;
    const {errors, viewAnswer} = translate;
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
      return x.sentenceNo < +sentenceNo && x.chinese;
    }).reverse()[0];
    const nextSentence = sentences.docs.filter((x) => {
      return x.sentenceNo > +sentenceNo && x.chinese;
    })[0];
    const prevId = prevSentence ? prevSentence.sentenceNo : 0;
    const nextId = nextSentence ? nextSentence.sentenceNo : 0;

    return (
      <div className="translate">
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
          <Instruction text="请翻译" />
          <div className="col-xs-12 answer-block">
            <div className="col-xs-12 sentence-chinese">
              {sentence.chinese}
            </div>
            {
              viewAnswer ?
              <div className="col-xs-12 translate-answer">
                {
                  sentence.audio ?
                  <AudioPlayer audios={[sentence.audio]} key={sentence._id}>
                    <div>{sentence.sentenceNo} {sentence.english} <i className="icon-voice" style={{'verticalAlign': 'middle'}}/></div>
                    <div>{sentence.sentenceNo} {sentence.english} <i className="icon-voice" style={{'verticalAlign': 'middle'}}/></div>
                  </AudioPlayer>
                  : sentence.english
                }
              </div>
              :
              ''
            }
          </div>
          <ErrorTip error={errors.server} />
        </div>
        <nav className="navbar navbar-fixed-bottom bottom-nav">
          <ul className="nav navbar-nav">
            <li className="col-xs-1 no-padding-col">
              {
                prevId ?
                <Link className="nav-link" to={`/home/courses/${courseNo}/lessons/${lessonNo}/translate/${prevId}`}>
                  <i className="icon-left" />
                </Link>
                :
                ''
              }
            </li>
            <li className="col-xs-10 no-padding-col text-xs-center">
            {
              viewAnswer ?
              (
                nextId ?
                <Link className="bottom-nav-btn btn btn-primary-outline col-xs-12" to={`/home/courses/${courseNo}/lessons/${lessonNo}/translate/${nextId}`} >
                  下一句
                </Link>
                :
                <Link className="bottom-nav-btn btn btn-primary-outline col-xs-12" to={`/home/courses/${courseNo}/lessons/${lessonNo}/translate/1`} >
                  再来一遍
                </Link>
              )
              :
              <button className="bottom-nav-btn btn btn-primary-outline col-xs-12" onClick={this.props.showTranslateAnswer}>
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

export default connect(mapStateToProps, Object.assign(translateActions, sentencesActions))(TranslateView);

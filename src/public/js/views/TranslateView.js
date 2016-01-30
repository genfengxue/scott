import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import { Provider, connect } from 'react-redux';
import {actions as translateActions} from '../redux/translate';
import {actions as sentencesActions} from '../redux/sentences';
import {Link} from 'react-router';
import ErrorTip from '../components/ErrorTip';
import AudioPlayer from '../components/AudioPlayer';

const mapStateToProps = ({translate, sentences}) => ({
  translate, sentences
});

class TranslateView extends Component {
  static propTypes = {
    params: PropTypes.object,
    fetchSentencesAsync: PropTypes.func,
    showTranslateAnswer: PropTypes.func,
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
    if (course && lesson) {
      document.title = `翻译-Lesson${lesson.lessonNo}-${course.chineseTitle}`;
    }
    const {translate, sentences} = this.props;
    const {errors, viewAnswer} = translate;
    const {courseNo, lessonNo, sentenceNo} = this.props.params;

    const sentence =  sentences.docs.filter((sentence) => {
      return +sentence.sentenceNo === +this.props.params.sentenceNo;
    })[0];
    if (!sentence) {
      return <div>Loading...</div>;
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
      <div className="translate text-center">
        <div className="text-left top-nav">
          <Link className="nav-btn" to={`/home/courses/${courseNo}`}>
            <i className="icon-left" />
          </Link>
        </div>
        <div className="answer-block">
          {sentence.chinese}
        </div>
        {
          viewAnswer ?
          <div className="translate-answer">
            {
              sentence.audio ?
              <AudioPlayer audios={[sentence.audio]}>
                <div>{sentence.english} <i className="icon-voice" style={{'verticalAlign': 'middle'}}/></div>
                <div>{sentence.english} <i className="icon-voice" style={{'verticalAlign': 'middle'}}/></div>
              </AudioPlayer>
              : sentence.english
            }
          </div>
          :
          <button className="btn btn-primary btn-o" onClick={this.props.showTranslateAnswer}>
            点击这里查看答案
          </button>
        }
        <ErrorTip error={errors.server} />
        <div className="bottom-nav">
          {
            prevId ?
            <Link to={`/home/courses/${courseNo}/lessons/${lessonNo}/translate/${prevId}`}
              className="pull-left nav-btn">
              <i className="icon-left" />
            </Link> :
            ''
          }
          {
            nextId ?
            <Link to={`/home/courses/${courseNo}/lessons/${lessonNo}/translate/${nextId}`}
              className="pull-right nav-btn">
              <i className="icon-right" />
            </Link> :
            ''
          }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, Object.assign(translateActions, sentencesActions))(TranslateView);

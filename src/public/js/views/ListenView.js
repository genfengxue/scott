import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import { Provider, connect } from 'react-redux';
import {actions as listenActions} from '../redux/listen';
import {actions as sentencesActions} from '../redux/sentences';
import {Link} from 'react-router';
import ErrorTip from '../components/ErrorTip';
import AudioPlayer from '../components/AudioPlayer';

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
      <div className="listen text-center">
        <div className="text-left top-nav">
          <Link className="nav-btn" to={`/home/courses/${courseNo}`}>
            <i className="icon-left" />
          </Link>
        </div>
        <div className="answer-block">
          {viewAnswer ?
          <div className="listen-answer">
            {sentence.english}
          </div>
          :
          <div>
            <div className="listen-answer fade-out">
              {sentence.english}
            </div>
            <button className="btn btn-primary btn-o review-answer-btn" onClick={this.props.showListenAnswer}>
              点击这里查看答案
            </button>
          </div>}
        </div>
        {
          sentence.audio ?
          <AudioPlayer key={sentence._id} audios={[sentence.audio]} autoplay={true} />
          : ''
        }
        <div className="bottom-nav">
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
    );
  }
}

export default connect(mapStateToProps, Object.assign(listenActions, sentencesActions))(ListenView);

import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import { Provider, connect } from 'react-redux';
import {actions} from '../redux/translate';
import {Link} from 'react-router';
import ErrorTip from '../components/ErrorTip';
import AudioPlayer from '../components/AudioPlayer';

const mapStateToProps = ({translate}) => ({
  translate
});

class TranslateView extends Component {
  static propTypes = {
    params: PropTypes.object,
    fetchLessonAsync: PropTypes.func,
    showTranslateAnswer: PropTypes.func,
  };

  constructor(props) {
    super();
    props.fetchLessonAsync(props.params.lessonId);
  }

  componentWillUpdate(nextProps) {
    console.log(nextProps);
    if (nextProps.params.lessonId != this.props.params.lessonId) {
      this.props.fetchLessonAsync(nextProps.params.lessonId);
    }
  }

  render() {
    const {translate} = this.props;
    const {lesson, errors, viewAnswer} = translate;
    return (
      <div className="translate text-center">
        <div>
          {lesson.ch}
        </div>
        {
          viewAnswer ?
          <div className="translate-answer">
            {lesson.en}
            {
              lesson.audios ?
              <AudioPlayer audios={lesson.audios} />
              : ''
            }
          </div>
          :
          <button className="btn btn-primary btn-o" onClick={this.props.showTranslateAnswer}>
            点击这里查看答案
          </button>
        }
        <ErrorTip error={errors.server} />
        <div className="bottom-nav">
          {lesson.prevId ? <Link to={`/home/translate/${lesson.prevId}`} className="pull-left">prev</Link> : ''}
          {lesson.nextId ? <Link to={`/home/translate/${lesson.nextId}`} className="pull-right">next</Link> : ''}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(TranslateView);

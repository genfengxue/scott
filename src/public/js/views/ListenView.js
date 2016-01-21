import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import { Provider, connect } from 'react-redux';
import {actions} from '../redux/listen';
import {Link} from 'react-router';
import ErrorTip from '../components/ErrorTip';
import AudioPlayer from '../components/AudioPlayer';

const mapStateToProps = ({listen}) => ({
  listen
});

class ListenView extends Component {
  static propTypes = {
    params: PropTypes.object,
    fetchLessonAsync: PropTypes.func,
    showListenAnswer: PropTypes.func,
  };

  constructor(props) {
    super();
    props.fetchLessonAsync(props.params.lessonNo);
  }

  componentWillUpdate(nextProps) {
    console.log(nextProps);
    if (nextProps.params.lessonNo != this.props.params.lessonNo) {
      this.props.fetchLessonAsync(nextProps.params.lessonNo);
    }
  }

  render() {
    const {listen} = this.props;
    const {lesson, errors, viewAnswer} = listen;
    return (
      <div className="listen text-center">
        {
          viewAnswer ?
          <div className="listen-answer">
            {lesson.en}
          </div>
          :
          <button className="btn btn-primary btn-o" onClick={this.props.showListenAnswer}>
            点击这里查看答案
          </button>
        }
        {
          lesson.audios ?
          <AudioPlayer audios={lesson.audios} autoplay={true} />
          : ''
        }
        <div className="bottom-nav">
          {lesson.prevId ? <Link to={`/home/listen/${lesson.prevId}`} className="pull-left">prev</Link> : ''}
          {lesson.nextId ? <Link to={`/home/listen/${lesson.nextId}`} className="pull-right">next</Link> : ''}
        </div>
        <ErrorTip error={errors.server} />
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(ListenView);

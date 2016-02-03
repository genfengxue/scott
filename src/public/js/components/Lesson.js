import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class Lesson extends Component {
  static propTypes = {
    lesson: PropTypes.object,
  };

  render() {
    const {lesson} = this.props;
    return (
      <div className="clearfix col-xs-12 lesson">
        <div className="lesson-name">
          Lesson {lesson.lessonNo}
        </div>
        <div className="actions">
          {lesson.hasListen ? <Link className="btn btn-primary-outline action-btn btn-sm" to={`/home/courses/${lesson.courseNo}/lessons/${lesson.lessonNo}/listen/1`}>跟读</Link> : ''}
          {lesson.hasTranslate ? <Link className="btn btn-primary-outline action-btn btn-sm" to={`/home/courses/${lesson.courseNo}/lessons/${lesson.lessonNo}/translate/1`}>翻译</Link> : ''}
        </div>
      </div>
    );
  }

}

export default Lesson;

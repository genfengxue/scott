import React, {Component, PropTypes} from 'react';
import ajax from '../common/ajax';
import {actions} from '../redux/lessons';
import {Link} from 'react-router';

class Lesson extends Component {
  static propTypes = {
    lesson: PropTypes.object,
  };

  render() {
    const {lesson} = this.props;
    return (
      <div className="lesson clearfix">
        <div className="lesson-name">
          Lesson {lesson.lessonNo}
        </div>
        <div className="actions">
          {lesson.hasListen ? <Link className="btn btn-o btn-primary action-btn" to={`/home/courses/${lesson.courseNo}/lessons/${lesson.lessonNo}/listen/1`}>听力</Link> : ''}
          {lesson.hasTranslate ? <Link className="btn btn-o btn-primary action-btn" to={`/home/courses/${lesson.courseNo}/lessons/${lesson.lessonNo}/translate/1`}>翻译</Link> : ''}
        </div>
      </div>
    );
  }

}

export default Lesson;

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class Lesson extends Component {
  static propTypes = {
    lesson: PropTypes.object,
    type: PropTypes.string,
  };

  render() {
    const {lesson, type} = this.props;
    return (
      <div className="clearfix col-xs-12 lesson">
        <Link className="lesson-name" to={`/home/courses/${lesson.courseNo}/lessons/${lesson.lessonNo}/${type || 'listen'}/1`}>
          Lesson {lesson.lessonNo}
        </Link>
      </div>
    );
  }

}

export default Lesson;

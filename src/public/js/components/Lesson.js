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
        <Link className="lesson-name" to={`/home/courses/${lesson.courseNo}/lessons/${lesson.lessonNo}/warm/?type=${type || 'listen'}`}>
          {lesson.englishTitle}
        </Link>
      </div>
    );
  }

}

export default Lesson;

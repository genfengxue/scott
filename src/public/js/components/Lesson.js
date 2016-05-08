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
      <li className="clearfix col-xs-12 lesson-name">
        <Link to={`/home/courses/${lesson.courseNo}/lessons/${lesson.lessonNo}/warm/?type=${type || 'listen'}`}>
          {lesson.englishTitle}
        </Link>
      </li>
    );
  }

}

export default Lesson;

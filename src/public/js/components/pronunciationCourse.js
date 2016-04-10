import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class PronunciationCourse extends Component {
  static propTypes = {
    course: PropTypes.object,
    type: PropTypes.string,
  };

  render() {
    const {course, type} = this.props;
    window.type = this.props;
    return (
      <div className="pronunciation-course clearfix">
        <Link to={`/home/pronunciation_courses/${course.courseNo}`}>
          <h4 className="pronunciation-course-name text-xs-center">
            {course.chineseTitle}
          </h4>
          <span className="lesson-count">{course.lessonsCount}</span>
        </Link>
      </div>
    );
  }

}

export default PronunciationCourse;

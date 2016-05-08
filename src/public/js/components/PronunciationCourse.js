import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class PronunciationCourse extends Component {
  static propTypes = {
    course: PropTypes.object,
    type: PropTypes.string,
  };

  render() {
    const {course} = this.props;
    const style = {};
    if (course && course.imageUrl) {
      style.backgroundImage = `url('${course.imageUrl}')`;
    }
    return (
      <div className="pronunciation-course clearfix">
        <Link to={`/home/pronunciation_courses/${course.courseNo}/lessons/`}>
          <h4 className="pronunciation-course-name text-xs-center">
            <img src={course.imageUrl} />
          </h4>
          <span className="lesson-count">{course.lessonCount}</span>
        </Link>
      </div>
    );
  }

}

export default PronunciationCourse;

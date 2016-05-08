import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class Course extends Component {
  static propTypes = {
    course: PropTypes.object,
    type: PropTypes.string,
  };

  render() {
    const {course, type} = this.props;
    return (
      <div className="course clearfix">
        <Link to={`/home/courses/${course.courseNo}?type=${type}`}>
          <h4 className="course-name text-xs-center">
            <img src={course.imageUrl} alt={course.chineseTitle} />
          </h4>
        </Link>
      </div>
    );
  }

}

export default Course;

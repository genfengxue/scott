import React, {Component, PropTypes} from 'react';
import ajax from '../common/ajax';
import {actions} from '../redux/courses';
import {Link} from 'react-router';

class Course extends Component {
  static propTypes = {
    course: PropTypes.object,
  };

  render() {
    const {course} = this.props;
    const courseStyle = {
      'backgroundImage': `url('${course.imageUrl}')`,
    };
    return (
      <div className="course clearfix">
        <Link to={`/home/courses/${course.courseNo}`}>
          <div className="course-image" style={courseStyle}/>
          <h4 className="course-name text-center">
            {course.chineseTitle}
          </h4>
        </Link>
      </div>
    );
  }

}

export default Course;

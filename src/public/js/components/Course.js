import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class Course extends Component {
  static propTypes = {
    course: PropTypes.object,
    type: PropTypes.string,
  };

  render() {
    const {course, type} = this.props;
    const courseStyle = {
      'backgroundImage': `url('${course.imageUrl}')`,
    };
    return (
      <div className="course clearfix">
        <Link to={`/home/courses/${course.courseNo}?type=${type}`}>
          <div className="course-image" style={courseStyle}/>
          <h4 className="course-name text-xs-center">
            {course.chineseTitle}
          </h4>
        </Link>
      </div>
    );
  }

}

export default Course;

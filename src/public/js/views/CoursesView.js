import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import CourseList from '../components/CourseList';
import {actions} from '../redux/courses';
import setTitle from '../common/setTitle';

const mapStateToProps = ({courses}) => ({
  courses,
});

class CoursesView extends Component {
  static propTypes = {
    courses: PropTypes.object.isRequired,
    fetchCoursesAsync: PropTypes.func.isRequired,
    fetchMoreCoursesAsync: PropTypes.func.isRequired,
  };

  constructor(props) {
    super();
    props.fetchCoursesAsync();
  }

  render() {
    setTitle('Wind 教口语');
    return (
      <div>
        <CourseList courses={this.props.courses} loadMore={this.props.fetchMoreCoursesAsync} />
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(CoursesView);

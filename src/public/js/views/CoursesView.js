import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import { Provider, connect } from 'react-redux';
import CourseList from '../components/CourseList';
import {actions} from '../redux/courses';

const mapStateToProps = ({courses}) => ({
  courses
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
    document.title = 'Wind 教口语';
    return (
      <div>
        <CourseList courses={this.props.courses} loadMore={this.props.fetchMoreCoursesAsync} />
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(CoursesView);

import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import { Provider, connect } from 'react-redux';
import LessonList from '../components/LessonList';
import {actions} from '../redux/lessons';
import {Link} from 'react-router';

const mapStateToProps = ({lessons}) => ({
  lessons
});

class LessonsView extends Component {
  static propTypes = {
    lessons: PropTypes.object.isRequired,
    fetchLessonsAsync: PropTypes.func.isRequired,
    fetchMoreLessonsAsync: PropTypes.func.isRequired,
  };

  constructor(props) {
    super();
    props.fetchLessonsAsync(props.params.courseNo);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.params.courseNo != this.props.params.courseNo) {
      console.log(nextProps);
      this.props.fetchLessonsAsync(nextProps.params.courseNo);
    }
  }

  render() {
    const course = this.props.lessons.course;
    if (course) {
      document.title = course.chineseTitle;
    }
    const courseNo = this.props.params.courseNo;
    return (
      <div>
        <nav className="navbar">
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to={`/`}>
                <i className="icon-left" />
              </Link>
            </li>
          </ul>
        </nav>
        <LessonList lessons={this.props.lessons} loadMore={(page) => this.props.fetchMoreLessonsAsync(page, courseNo)} />
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(LessonsView);

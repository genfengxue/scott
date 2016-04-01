import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import CourseList from '../components/CourseList';
import {actions} from '../redux/pronunciationCourses';
import {Link} from 'react-router';

const mapStateToProps = ({pronunciationCourses}) => ({
  pronunciationCourses,
});

class PronunciationCoursesView extends Component {

  static propTypes = {
    pronunciationCourses: PropTypes.object.isRequired,
    fetchPronunciationCoursesAsync: PropTypes.func.isRequired,
    location: PropTypes.object,
  };

  constructor(props) {
    super();
    props.fetchPronunciationCoursesAsync();
  }

  render() {
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
        <CourseList
          courses={this.props.pronunciationCourses} />
      </div>
    )
  }
}

export default connect(mapStateToProps, actions)(PronunciationCoursesView)

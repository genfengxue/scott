import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import PronunciationCourseList from '../components/PronunciationCourseList';
import {actions} from '../redux/pronunciationCourses';
import {Link} from 'react-router';
import setTitle from '../common/setTitle';

const mapStateToProps = ({pronunciationCourses}) => ({
  pronunciationCourses,
});

class PronunciationCoursesView extends Component {

  static propTypes = {
    pronunciationCourses: PropTypes.object.isRequired,
    fetchPronunciationCoursesAsync: PropTypes.func.isRequired,
    location: PropTypes.object,
    fetchMorePronunciationCoursesAsync: PropTypes.func,
  };

  constructor(props) {
    super();
    props.fetchPronunciationCoursesAsync();
  }

  render() {
    setTitle( '发音训练-Wind教口语');
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
        <PronunciationCourseList
          loadMore={(page) => this.props.fetchMorePronunciationCoursesAsync(page)}
          courses={this.props.pronunciationCourses} />
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(PronunciationCoursesView);

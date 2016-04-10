import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import LessonList from '../components/LessonList';
import {actions} from '../redux/lessons';
import {Link} from 'react-router';
import setTitle from '../common/setTitle';

const mapStateToProps = ({lessons}) => ({
  lessons,
});

class PronunciationLessonsView extends Component {

  constructor(props) {
    super();
  }

  render() {
    return (
      <div className="pronunciation-lessons-view">
        <nav className="navbar">
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to={`/home/pronunciation_courses/`}>
                <i className="icon-left" />
              </Link>
            </li>
          </ul>
        </nav>
        <h2 className="text-xs-center">元音</h2>
        <p className="text-xs-center subtitle">Vowels</p>
        <ul className="pronunciation-lesson-list">
          <li className="pronunciation-lesson-name"><Link to={`/`}>Lesson 6</Link></li>
          <li className="pronunciation-lesson-name"><Link to={`/`}>Lesson 5</Link></li>
          <li className="pronunciation-lesson-name"><Link to={`/`}>Lesson 4</Link></li>
          <li className="pronunciation-lesson-name"><Link to={`/`}>Lesson 3</Link></li>
          <li className="pronunciation-lesson-name"><Link to={`/`}>Lesson 2</Link></li>
          <li className="pronunciation-lesson-name"><Link to={`/`}>Lesson 1</Link></li>
        </ul>
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(PronunciationLessonsView);

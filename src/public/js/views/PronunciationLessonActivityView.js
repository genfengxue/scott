import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import LessonList from '../components/LessonList';
import {actions} from '../redux/lessons';
import {Link} from 'react-router';
import setTitle from '../common/setTitle';

const mapStateToProps = ({lessons}) => ({
  lessons,
});

class PronunciationLessonActivityView extends Component {

  constructor(props) {
    super();
  }

  render() {
    return (
      <div className="pronunciation-activity-view">
        <nav className="navbar">
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to={`/home/pronunciation_courses/`}>
                <i className="icon-left" />
              </Link>
            </li>
          </ul>
        </nav>
        <div className="reading">
          <div className="course-info">
            <img src="http://7xr387.com1.z0.glb.clouddn.com/windwind.jpg" className="mentor-photo" />
            <p className="course-label">请听讲解</p>
          </div>
          <div className="course-content">
            <h6 className="pronunciation-symbol">cop [a]</h6>
            <ol>
              <li>[a]这个音标键盘上打不出来,键盘上能出来是这样的 :a</li>
              <li>这个音类似于你去看医生, 医生让你张大嘴说 "啊"</li>
              <li>这个音标在发音时比较靠后</li>
              <li>这个音典型错误是读成了 这个音类似于你去看医生,医生让你张大嘴说 "啊", 这个音典型错误是读成了 这个音类似于你去看医生,医生让你张大嘴说 "啊" </li>
            </ol>
          </div>
          <div className="course-buttons">
            <span className="boss-button"></span>
            <span className="sound-button"></span>
            <span className="next-button"></span>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(PronunciationLessonActivityView);

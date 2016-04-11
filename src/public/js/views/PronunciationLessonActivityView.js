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
        <div className="course-info">

          <img src="http://7xr387.com1.z0.glb.clouddn.com/windwind.jpg" className="mentor-photo" />
          <p className="course-label">请听讲解</p>
        </div>
        <div className="course-content">
          {/* TODO: This is a placeholder, should be replaced with video */}
          <img src="http://placehold.it/336x188" />

          {/* TODO: Listen */}
          <div className="listen-explain">
            <h6 className="pronunciation-symbol">cop [a]</h6>
            <ol>
              <li>[a]这个音标键盘上打不出来,键盘上能出来是这样的 :a</li>
              <li>这个音类似于你去看医生, 医生让你张大嘴说 "啊"</li>
              <li>这个音标在发音时比较靠后</li>
              <li>这个音典型错误是读成了 这个音类似于你去看医生,医生让你张大嘴说 "啊", 这个音典型错误是读成了 这个音类似于你去看医生,医生让你张大嘴说 "啊" </li>
            </ol>
          </div>
          {/* TODO: Reading */}
          <div className="reading-pronunciation">
            <h6>her here hair hire</h6>
            <p>[her][hir][her][hear]</p>
          </div>

          {/* TODO:  Fight boss */}
          <div className="fight-boss">
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>

            <form>
              <div className="form-group">
                <label>昵称</label>
                <input type="text" className="name"/>
              </div>
              <div className="form-group">
                <label>时间</label>
                <input type="text" className="time" placehold="分钟" />
              </div>
            </form>
          </div>
        </div>

        <div className="course-buttons">
          <span className="boss-button hidden"></span>
          <span className="sound-button hidden"></span>
          <span className="next-button hidden"></span>
          <span className="record-button hidden"></span>
          <span className="submit-button"></span>
          <span className="upload-button"></span>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(PronunciationLessonActivityView);

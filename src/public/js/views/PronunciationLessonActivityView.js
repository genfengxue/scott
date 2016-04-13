import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import {actions} from '../redux/pronunciationLessonActivity';
import {Link} from 'react-router';
import Slider from 'react-slick';

const mapStateToProps = ({pronunciationLessonActivity}) => ({
  pronunciationLessonActivity,
});

class PronunciationLessonActivityView extends Component {

  static propTypes = {
    pronunciationLessonActivity: PropTypes.object.isRequired,
    fetchPronunciationLessonsActivityAsync: PropTypes.func.isRequired,
  };

  constructor(props) {
    super();
    props.fetchPronunciationLessonsActivityAsync();
  }

  render() {
    const {docs} = this.props.pronunciationLessonActivity;
    window.pronunciationLessonActivity = this.props.pronunciationLessonActivity;

    const CustomPrevArrow = React.createClass({
      render() {
        return (
          <div className="slick-prev" {...this.props}><icon className="prev-button"></icon></div>
        );
      },
    });

    const CustomNextArrow = React.createClass({
      render() {
        return (
          <div className="slick-next" {...this.props}><icon className="next-button"></icon></div>
        );
      },
    });

    const settings = {
      dots: false,
      swipe: false,
      touchMove: false,
      prevArrow: CustomPrevArrow,
      nextArrow: CustomNextArrow,
    };

    return (
      <div className="pronunciation-activity-view">
        <nav className="navbar">
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to={`/home/pronunciation_courses/2/lessons/`}>
                <i className="icon-left" />
              </Link>
            </li>
          </ul>
        </nav>

        <Slider {...settings}>
          {/* TODO: Listen */}
          <div className="activity-item">
            <div className="course-info">
              <img src="http://7xr387.com1.z0.glb.clouddn.com/windwind.jpg" className="mentor-photo" />
              <p className="course-label">请听讲解</p>
            </div>
            <div className="course-content">
              {/* TODO: This is a placeholder, should be replaced with video */}
              <img src="http://placehold.it/335x188" />

              <div className="listen-explain">
                <h6 className="pronunciation-symbol">cop [a]</h6>
                <ol>
                  <li>[a]这个音标键盘上打不出来,键盘上能出来是这样的 :a</li>
                  <li>这个音类似于你去看医生, 医生让你张大嘴说 "啊"</li>
                  <li>这个音标在发音时比较靠后</li>
                  <li>这个音典型错误是读成了 这个音类似于你去看医生,医生让你张大嘴说 "啊", 这个音典型错误是读成了 这个音类似于你去看医生,医生让你张大嘴说 "啊" </li>
                </ol>
              </div>
            </div>
          </div>

          {/* TODO: Reading */}
          <div className="activity-item">
            <div className="course-info">
              <img src="http://7xr387.com1.z0.glb.clouddn.com/windwind.jpg" className="mentor-photo" />
              <p className="course-label">请朗读整段文本</p>
            </div>
            <div className="course-content">
              <div className="reading-pronunciation">
                <h6>her here hair hire</h6>
                <p>[her][hir][her][hear]</p>
              </div>
            </div>
          </div>

          {/* TODO:  Fight boss */}
          <div className="activity-item">
            <div className="course-info">
              <img src="http://7xr387.com1.z0.glb.clouddn.com/windwind.jpg" className="mentor-photo" />
              <p className="course-label">请朗读</p>
            </div>
            <div className="course-content">
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
          </div>
        </Slider>

      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(PronunciationLessonActivityView);

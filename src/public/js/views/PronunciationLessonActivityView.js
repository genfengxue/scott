import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import {actions} from '../redux/pronunciationLessonActivity';
import {Link} from 'react-router';
import Slider from 'react-slick';
import Progress from 'react-progress';

import AudioPlayer from '../components/AudioPlayer';

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
      infinite: false
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

        <div className="progress-bar">
          <Progress percent={30}/>
        </div>

        <Slider {...settings}>
          {docs.map((lessonActivity) => {
            return (
              <div key={lessonActivity.index}>
                {function(){
                  if (lessonActivity.type == '讲解') {
                    return (
                      <div className="activity-item">
                        <div className="course-info">
                          <img src="http://7xr387.com1.z0.glb.clouddn.com/windwind.jpg" className="mentor-photo" />
                          <p className="course-label">请听讲解</p>
                        </div>
                        <div className="listen-explain">
                          <div dangerouslySetInnerHTML={{__html: lessonActivity.description}}></div>
                        </div>

                        {
                          lessonActivity.audio
                            ? <AudioPlayer audios={[lessonActivity.audio]} autoplay key={lessonActivity.audio}></AudioPlayer>
                            : ''
                        }

                      </div>
                    )
                  }
                }.call(this)}

                {function(){
                  if (lessonActivity.type == '朗读') {
                    return (
                      <div className="activity-item">
                        <div className="course-info">
                          <img src="http://7xr387.com1.z0.glb.clouddn.com/windwind.jpg" className="mentor-photo" />
                          <p className="course-label">请朗读整段文本</p>
                        </div>
                        <div className="course-content">
                          <div className="reading-pronunciation">
                            <div dangerouslySetInnerHTML={{__html: lessonActivity.description}}></div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                }.call(this)}
              </div>
            )
          })}
        </Slider>

        <div className="course-buttons">
          <span className="sound-button"></span>
          <span className="boss-button hidden"></span>
          <span className="record-button hidden"></span>
          <span className="submit-button hidden"></span>
          <span className="upload-button hidden"></span>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(PronunciationLessonActivityView);

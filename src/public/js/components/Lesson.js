import React, {Component, PropTypes} from 'react';
import ajax from '../common/ajax';
import {actions} from '../redux/lessons';

class Lesson extends Component {
  static propTypes = {
    lesson: PropTypes.object,
  };

  render() {
    const {lesson} = this.props;
    return (
      <div className="lesson clearfix">
        <div className="lesson-name">
          {lesson.name}
        </div>
        <div className="actions">
          <button className="btn btn-o btn-primary action-btn">听力</button>
          <button className="btn btn-o btn-primary action-btn">翻译</button>
        </div>
      </div>
    );
  }

}

export default Lesson;

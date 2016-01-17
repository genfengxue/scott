import React, {Component, PropTypes} from 'react';
import ajax from '../common/ajax';
import {actions} from '../redux/lessons';
import {Link} from 'react-router';

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
          <Link className="btn btn-o btn-primary action-btn" to={`/home/listen/${lesson.id}`}>听力</Link>
          <Link className="btn btn-o btn-primary action-btn" to={`/home/translate/${lesson.id}`}>翻译</Link>
        </div>
      </div>
    );
  }

}

export default Lesson;

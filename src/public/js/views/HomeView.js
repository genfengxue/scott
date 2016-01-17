import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import { Provider, connect } from 'react-redux';
import LessonList from '../components/LessonList';
import {actions} from '../redux/lessons';

const mapStateToProps = ({lessons}) => ({
  lessons
});

class HomeView extends Component {
  static propTypes = {
    lessons: PropTypes.object.isRequired,
    fetchLessonsAsync: PropTypes.func.isRequired,
    fetchMoreLessonsAsync: PropTypes.func.isRequired,
  };

  constructor(props) {
    super();
    props.fetchLessonsAsync();
  }

  render() {
    return (
      <div>
        <LessonList lessons={this.props.lessons} loadMore={this.props.fetchMoreLessonsAsync} />
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(HomeView);

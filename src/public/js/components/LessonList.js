import React, {Component, PropTypes} from 'react';
import ajax from '../common/ajax';
import {actions} from '../redux/lessons';
import reactInfiniteScroll from 'react-infinite-scroll';
import Lesson from './Lesson';

const InfiniteScroll = reactInfiniteScroll(React);

class LessonList extends Component {
  static propTypes = {
    lessons: PropTypes.object,
    loadMore: PropTypes.func,
  };

  render() {
    const {results, count} = this.props.lessons;
    const hasMore = results.length < count;
    return (
      <div className="lesson-list">
        <InfiniteScroll
          pageStart={0}
          loadMore={this.props.loadMore}
          hasMore={hasMore}
          loader={<div className="loader">Loading...</div>}>
          {results.map((lesson) => {
            return (
              <Lesson key={lesson.id} lesson={lesson}>
              </Lesson>
            );
          })}
        </InfiniteScroll>
      </div>
    );
  }

}

export default LessonList;

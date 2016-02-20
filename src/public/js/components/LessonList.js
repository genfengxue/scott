import React, {Component, PropTypes} from 'react';
import reactInfiniteScroll from 'react-infinite-scroll';
import Lesson from './Lesson';

const InfiniteScroll = reactInfiniteScroll(React);

class LessonList extends Component {
  static propTypes = {
    lessons: PropTypes.object,
    loadMore: PropTypes.func,
    type: PropTypes.string,
  };

  render() {
    const {docs, total} = this.props.lessons;
    const hasMore = docs.length < total;
    return (
      <div className="lesson-list">
        <InfiniteScroll
          pageStart={1}
          loadMore={this.props.loadMore}
          hasMore={hasMore}
          loader={<div className="loader">Loading...</div>}>
          {docs.map((lesson) => {
            return (
              <Lesson key={lesson._id} lesson={lesson} type={this.props.type} />
            );
          })}
        </InfiniteScroll>
      </div>
    );
  }

}

export default LessonList;

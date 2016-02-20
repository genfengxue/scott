import React, {Component, PropTypes} from 'react';
import reactInfiniteScroll from 'react-infinite-scroll';
import Course from './Course';

const InfiniteScroll = reactInfiniteScroll(React);

class CourseList extends Component {
  static propTypes = {
    courses: PropTypes.object,
    loadMore: PropTypes.func,
    type: PropTypes.string,
  };

  render() {
    const {docs, total} = this.props.courses;
    const hasMore = docs.length < total;
    return (
      <div className="course-list">
        <InfiniteScroll
          pageStart={1}
          loadMore={this.props.loadMore}
          hasMore={hasMore}
          loader={<div className="loader">Loading...</div>}>
          {docs.map((course) => {
            return (
              <Course key={course._id} course={course} type={this.props.type} />
            );
          })}
        </InfiniteScroll>
      </div>
    );
  }

}

export default CourseList;

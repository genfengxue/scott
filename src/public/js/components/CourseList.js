import React, {Component, PropTypes} from 'react';
import ajax from '../common/ajax';
import {actions} from '../redux/courses';
import reactInfiniteScroll from 'react-infinite-scroll';
import Course from './Course';

const InfiniteScroll = reactInfiniteScroll(React);

class CourseList extends Component {
  static propTypes = {
    courses: PropTypes.object,
    loadMore: PropTypes.func,
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
              <Course key={course._id} course={course}>
              </Course>
            );
          })}
        </InfiniteScroll>
      </div>
    );
  }

}

export default CourseList;

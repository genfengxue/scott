import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {actions} from '../redux/pronunciationLessons';
import {Link} from 'react-router';
import reactInfiniteScroll from 'react-infinite-scroll';

const InfiniteScroll = reactInfiniteScroll(React);

const mapStateToProps = ({pronunciationLessons}) => ({
  pronunciationLessons,
});

class PronunciationLessonsView extends Component {

  static propTypes = {
    pronunciationLessons: PropTypes.object.isRequired,
    fetchPronunciationLessonsAsync: PropTypes.func.isRequired,
    fetchMorePronunciationLessonsAsync: PropTypes.func.isRequired,
    params: PropTypes.object,
  };

  constructor(props) {
    super();
    props.fetchPronunciationLessonsAsync(props.params.courseNo);
  }

  render() {
    const {docs, total} = this.props.pronunciationLessons;
    const {courseNo} = this.props.params;
    const hasMore = docs.length < total;
    return (
      <div className="pronunciation-lessons-view">
        <nav className="navbar">
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to={`/home/pronunciation_courses/`}>
                <i className="icon-left" />
              </Link>
            </li>
          </ul>
        </nav>
        <h2 className="text-xs-center">元音</h2>
        <p className="text-xs-center subtitle">Vowels</p>
        <ul className="pronunciation-lesson-list">
          <InfiniteScroll
            pageStart={1}
            loadMore={(page) => this.props.fetchMorePronunciationLessonsAsync(page, courseNo)}
            hasMore={hasMore}
            loader={<li className="loader">Loading...</li>}>
            {docs.map((lesson) => {
              return (
                <li className="pronunciation-lesson-name" key={lesson.lessonNo}>
                  <Link to={`/home/pronunciation_courses/${courseNo}/lessons/${lesson.lessonNo}` }>{lesson.chineseTitle}</Link>
                </li>
              );
            })}
          </InfiniteScroll>
        </ul>
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(PronunciationLessonsView);

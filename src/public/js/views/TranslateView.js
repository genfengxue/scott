import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {actions as translateActions} from '../redux/translate';
import {actions as sentencesActions} from '../redux/sentences';
import {actions as shiftingActions} from '../redux/shifting';
import {Link} from 'react-router';
import ErrorTip from '../components/ErrorTip';
import AudioPlayer from '../components/AudioPlayer';
import Instruction from '../components/Instruction';
import Header from '../components/Header';
import setTitle from '../common/setTitle';
import CollectionModal from '../components/CollectionModal';
import {RATES} from '../redux/shifting';

const mapStateToProps = ({translate, sentences, shifting}) => ({
  translate, sentences, shifting,
});

class TranslateView extends Component {
  static propTypes = {
    params: PropTypes.object,
    fetchSentencesAsync: PropTypes.func,
    toggleCollectionModal: PropTypes.func,
    toggleSpeeds: PropTypes.func,
    shiftSpeed: PropTypes.func,
    showTranslateAnswer: PropTypes.func,
    translateInit: PropTypes.func,
    sentences: PropTypes.object,
    translate: PropTypes.object,
    shifting: PropTypes.object,
  };

  constructor(props) {
    super();
    props.translateInit();
    props.fetchSentencesAsync(props.params.courseNo, props.params.lessonNo);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.params.lessonNo !== this.props.params.lessonNo || nextProps.params.courseNo !== this.props.params.courseNo) {
      this.props.fetchSentencesAsync(nextProps.params.courseNo, nextProps.params.lessonNo);
      this.props.translateInit();
    }
    if (nextProps.params.sentenceNo !== this.props.params.sentenceNo) {
      this.props.translateInit();
    }
  }

  render() {
    const course = this.props.sentences.course;
    const lesson = this.props.sentences.lesson;
    const {translate, sentences, shifting} = this.props;
    const {errors, viewAnswer, showCollectionModal} = translate;
    const {courseNo, lessonNo, sentenceNo} = this.props.params;

    const sentence = sentences.docs.filter((x) => {
      return +x.sentenceNo === +sentenceNo && +x.lessonNo === +lessonNo && +x.courseNo === +courseNo;
    })[0];
    if (!sentence) {
      return <div>Loading...</div>;
    }
    if (course && lesson && sentence) {
      setTitle(`${sentence.sentenceNo}/${sentences.docs.length}-Lesson${lesson.lessonNo}-${course.chineseTitle}`);
    }

    // audios
    let audios;
    /**
     * Get the rated audio source according to original src and rate.
     * @param {String} src: original src
     * @param {String} rate: the rate, '0.8', '1.0'
     */
    const getRatedAudioSrc = (src, rate) => {
      const suffix = '.mp3';
      const rateSrc = rate.toString().replace('.', '_');
      let result = src;
      result = result.substr(0, result.length - suffix.length) + '@' + rateSrc + suffix;
      const suffixes = ['.mp3', '.ogg', '.wav'];
      return suffixes.map((x) => {
        return result.substr(0, result.length - suffix.length) + x;
      });
    };
    if (sentence && sentence.audio) {
      audios = getRatedAudioSrc(sentence.audio, shifting.speed);
    }

    // get prev next pointer
    const prevSentence = sentences.docs.filter((x) => {
      return x.sentenceNo < +sentenceNo && x.chinese;
    }).reverse()[0];
    const nextSentence = sentences.docs.filter((x) => {
      return x.sentenceNo > +sentenceNo && x.chinese;
    })[0];
    const prevId = prevSentence ? prevSentence.sentenceNo : 0;
    const nextId = nextSentence ? nextSentence.sentenceNo : 0;

    return (
      <div className="translate">
        <Header back={`/home/courses/${courseNo}?type=translate`}>
          <a className="nav-link" onClick={() => this.props.toggleCollectionModal(true)} >收藏</a>
          <a className="nav-link" onClick={e => {
            e.stopPropagation();
            this.props.toggleSpeeds();
          }}>难度</a>
          {
            shifting.showSpeeds ?
            <div>
              {
                RATES.map((rate) => {
                  return (
                    <a className={'nav-link col-xs-12' + (shifting.speed === rate ? ' selected' : '')} key={rate} onClick={() => {
                      this.props.shiftSpeed(rate);
                    }}>
                      {rate}
                      {
                        shifting.speed === rate ?
                        <i className="icon-tick pull-xs-right" />
                        :
                        ''
                      }
                    </a>
                  );
                })
              }
            </div>
            :
            ''
          }
        </Header>
        <CollectionModal
          isOpen={showCollectionModal}
          onRequestClose={() => this.props.toggleCollectionModal(false)} />
        <div className="container">
          <Instruction text="请翻译" />
          <div className="col-xs-12 answer-block">
            <div className="col-xs-12 sentence-chinese">
              {sentence.chinese}
            </div>
            {
              viewAnswer ?
              <div className="col-xs-12 translate-answer">
                {
                  !!audios ?
                  <AudioPlayer audios={audios} key={audios[0]}>
                    <div>{sentence.english} <i className="icon-voice" /></div>
                    <div>{sentence.english} <i className="icon-voice-mute" /></div>
                    <div>{sentence.english} </div>
                  </AudioPlayer>
                  : sentence.english
                }
              </div>
              :
              ''
            }
          </div>
          <ErrorTip error={errors.server} />
        </div>
        <nav className="navbar navbar-fixed-bottom bottom-nav">
          <ul className="nav navbar-nav">
            <li className="col-xs-1 no-padding-col">
              {
                prevId ?
                <Link className="nav-link" to={`/home/courses/${courseNo}/lessons/${lessonNo}/translate/${prevId}`}>
                  <i className="icon-left" />
                </Link>
                :
                ''
              }
            </li>
            <li className="col-xs-10 no-padding-col text-xs-center">
            {
              viewAnswer ?
              (
                nextId ?
                <Link className="bottom-nav-btn btn btn-primary-outline col-xs-12" onClick={() => this.props.translateInit()} to={`/home/courses/${courseNo}/lessons/${lessonNo}/translate/${nextId}`} >
                  下一句
                </Link>
                :
                <Link className="bottom-nav-btn btn btn-primary-outline col-xs-12" to={`/home/courses/${courseNo}/`} >
                  返回
                </Link>
              )
              :
              <button className="bottom-nav-btn btn btn-primary-outline col-xs-12" onClick={this.props.showTranslateAnswer}>
                查看答案
              </button>
            }
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default connect(mapStateToProps, Object.assign(translateActions, sentencesActions, shiftingActions))(TranslateView);

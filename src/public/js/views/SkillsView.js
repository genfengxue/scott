import React, {Component} from 'react';
import {Link} from 'react-router';
import setTitle from '../common/setTitle';
import PronunciationModal from '../components/PronunciationModal';

class SkillsView extends Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {};
  }

  render() {
    setTitle('Wind教口语');
    return (
      <div className="container skill-list">
        <h2 className="text-xs-center slogan">Wind教口语</h2>
        <Link className="text-xs-center skill-link pronunciation-item" to="/home/pronunciation_courses/">发音语调训练</Link>
        <Link className="text-xs-center skill-link listen-item" to="/home/courses/?type=listen">听力训练</Link>
        <Link className="text-xs-center skill-link translate-item" to="/home/courses/?type=translate">口语训练</Link>
        <PronunciationModal
          isOpen={this.state.showPronunciationModal}
          onRequestClose={() => this.setState({showPronunciationModal: false})} />
      </div>
    );
  }
}

export default SkillsView;

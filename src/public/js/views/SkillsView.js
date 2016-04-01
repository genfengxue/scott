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
        <Link className="text-xs-center skill-link" to="/home/pronunciation_courses/">发音语调训练</Link>
        <Link className="text-xs-center skill-link" to="/home/courses/?type=listen">听力训练</Link>
        <Link className="text-xs-center skill-link" to="/home/courses/?type=translate">口语训练</Link>
        <PronunciationModal
          isOpen={this.state.showPronunciationModal}
          onRequestClose={() => this.setState({showPronunciationModal: false})} />
      </div>
    );
  }
}

export default SkillsView;

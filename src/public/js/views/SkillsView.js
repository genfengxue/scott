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
    setTitle('Wind 教口语');
    return (
      <div className="container skill-list">
        <a className="text-xs-center skill-link" onClick={()=>this.setState({showPronunciationModal: true})}>发音语调训练</a>
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

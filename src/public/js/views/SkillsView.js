import React, {Component} from 'react';
import {Link} from 'react-router';
import setTitle from '../common/setTitle';

class SkillsView extends Component {
  static propTypes = {
  };

  constructor() {
    super();
  }

  render() {
    setTitle('Wind 教口语');
    return (
      <div className="container skill-list">
        <Link className="text-xs-center skill-link" to="/home/pronunciations/">发音语调训练</Link>
        <Link className="text-xs-center skill-link" to="/home/courses/?type=listen">听力训练</Link>
        <Link className="text-xs-center skill-link" to="/home/courses/?type=translate">口语训练</Link>
      </div>
    );
  }
}

export default SkillsView;

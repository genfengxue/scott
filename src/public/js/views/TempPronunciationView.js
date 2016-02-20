import React, {Component} from 'react';
import {Link} from 'react-router';
import setTitle from '../common/setTitle';

class TempPronunciationView extends Component {
  static propTypes = {
  };

  constructor() {
    super();
  }

  render() {
    setTitle('Wind 教口语');
    return (
      <div className="container">
        <nav className="navbar">
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to={`/`}>
                <i className="icon-left" />
              </Link>
            </li>
          </ul>
        </nav>
        <div className="col-xs-12">
          <h4>
            发音语调训练
          </h4>
          <div className="card card-block">
            <p className="card-text">
              Hi there~
            </p>
            <p className="card-text">
              发音语调部分暂时还没整合进来
            </p>
            <p className="card-text">
              请添加Wind老师个人微信 819432228, 免费获取训练内容
            </p>
            <p className="card-text">
              Wind <br />
              2016.2.18于华山
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default TempPronunciationView;

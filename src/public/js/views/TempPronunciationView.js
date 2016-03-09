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
    setTitle('Wind教口语');
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
              发音语调训练目前通过另外一款App进行
            </p>
            <p className="card-text">
              你可以添加我的个人微信819432228来获得另外那款App
            </p>
            <p className="card-text">
              我打算先开发其他功能，之后再把发音语调内容整合进来
            </p>
            <p className="card-text">
              cheers, <br />
              Wind
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default TempPronunciationView;

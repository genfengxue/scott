import babelPolyfill from 'babel-polyfill'; // eslint-disable-line no-unused-vars
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import Avatar from './components/avatar';
import ajax from './common/ajax';
import clone from 'lodash/lang/clone';

class Home extends Component {
  constructor() {
    super();
    this.fetchUser();
    this.state = {
      user: {},
    };
  }

  async fetchUser() {
    const user = await ajax.get('/api/auth/me/');
    this.setState({user});
    this.oldUser = clone(user, true);
  }

  render() {
    const {avatar_file, nickname} = this.state.user;
    return (
      <div className="content">
        <div className="form-group" key="1">
          <Avatar className="avatar-field" canEdit={false} image={avatar_file || '/img/default_avatar.png'} // eslint-disable-line camelcase
          />
        </div>
        <div className="form-group" key="2">
          <label>欢迎{nickname}</label>
        </div>
        <div className="form-group" key="3">
          <a className="btn btn-danger btn-lg confirm-btn" href="/continue/go/">继续前往</a>
        </div>
        <div className="form-group" key="4">
          <a className="btn btn-default btn-lg confirm-btn" href="/continue/back/">切换账户</a>
        </div>
        <div className="bottom-nav">
          <a href="/change_password/">修改密码</a>
          <span className="spliter"></span>
          <a href="/logout/">登出</a>
        </div>
      </div>
    );
  }
}

ReactDom.render(<Home />, document.getElementById('app'));

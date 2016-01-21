import React, {Component, PropTypes} from 'react';
import {actions} from '../redux/user';
import {actions as viewActions, LessonsViewSections} from '../redux/homeViewState';
import Avatar from './Avatar2';

class ProfilePanel extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {editingNickname: false};
  }

  updateEmail() {
    actions.updateUserEmail(this.refs.email.value);
  }

  render() {
    const user = this.props.user;
    const canResent = (new Date() - (user.lastEmailSentTime || 0)) > 3600 * 10000 ? true : false;
    const dispatch = this.props.dispatch;
    return (
      <div>
        <div className="form-group" key="12">
          <Avatar className="avatar-field" canEdit image={user.avatar_file || '/img/default_avatar.png'} dispatch={dispatch} />
        </div>
        <div className="form-group" key="13">
          <label>
            邮箱
            {
              !user.checkmail ?
              <span className="email-hint">
                <span className="badge">未验证</span>
                {
                  user.email && canResent ?
                  <a className="btn-xs btn-link" onClick={() => dispatch(actions.resendEmail()) }>重发激活邮件</a> : ''
                }
              </span> :
              <span className="email-hint">
                <span className="badge badge-success">已验证</span>
              </span>
            }
          </label>
          <div className="static-field">
            {user.email}
          </div>
          <i className="icon-edit edit-icon icon-btn"
            title="修改"
            onClick={() => dispatch(viewActions.changeView(LessonsViewSections.UPDATE_EMAIL))}></i>
        </div>
        <div className="form-group" key="14">
          <label>手机</label>
          <div className="static-field">
            {user.mobile}
          </div>
          <i className="icon-edit edit-icon icon-btn"
            title="修改"
            onClick={() => dispatch(viewActions.changeView(LessonsViewSections.UPDATE_MOBILE))}></i>
        </div>
        <div className="form-group" key="15">
          <label>昵称</label>
          {
            this.state.editingNickname ?
            <div key="16">
              <input className="form-control input-lg nickname-input"
                ref="nickname"
                defaultValue={user.nickname} />
              <i className="icon-tick confirm-nickname-icon icon-btn"
                title="确定"
                onClick={() => dispatch(actions.updateUserAsync({
                  'nickname': this.refs.nickname.value,
                })).then(() => this.setState({editingNickname: false}))}></i>
              <i className="icon-times edit-icon icon-btn"
                title="取消"
                onClick={() => this.setState({editingNickname: false})}></i>
            </div>
            :
            <div key="17">
              <div className="static-field">
                {user.nickname}
              </div>
              <i className="icon-edit edit-icon icon-btn"
                title="修改"
                onClick={() => this.setState({editingNickname: true})}></i>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default ProfilePanel;

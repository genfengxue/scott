import babelPolyfill from 'babel-polyfill'; // eslint-disable-line no-unused-vars
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import Avatar from './components/avatar';
import ajax from './common/ajax';
import clone from 'lodash/lang/clone';
import event from './common/eventAggregator';
import {validateEmail, validatePhone, validateRequired} from './common/validations';

class Home extends Component {
  constructor() {
    super();
    this.fetchUser();
    this.state = {
      user: {},
      updateMobileState: {
        captchaUrl: `/captcha.jpg/?r=${ Date.now()}`,
        canResent: true,
        errors: {},
      },
      updateEmailState: {
        errors: {},
        canResent: false,
      },
    };
  }

  componentDidMount() {
    event.on('user', (user) => {
      this.setState({user});
      this.oldUser = clone(user, true);
    });
  }

  async confirmNickname() {
    try {
      this.setState({editingNickname: false});
      const result = await ajax.put('/api/auth/me/', {nickname: this.state.user.nickname});
      this.setState({user: result});
      this.oldUser = clone(result, true);
    } catch (err) {
      // notify error
      this.setState({editingNickname: true});
      this.setState({user: clone(this.oldUser, true)});
    }
  }

  async updateMobile() {
    const updateMobileState = this.state.updateMobileState;
    const user = this.state.user;
    updateMobileState.errors = {};
    try {
      this.setState({updateMobileState});
      // await ajax.post('/dtp/userlogin/modify_username/', {
      const result = await ajax.post('/api/auth/modify_username/', {
        modify_type: 'mobile',
        username: this.state.updateMobileState.mobile,
        pollcode: this.state.updateMobileState.code,
      });
      updateMobileState.mobile = '';
      updateMobileState.code = '';
      updateMobileState.captcha = '';
      user.mobile = this.state.updateMobileState.mobile;
      this.oldUser = clone(user, true);
      this.setState({editingMobile: false, updateMobileState, user: result.result});
    } catch (err) {
      if (err.error) {
        switch (err.error.code) {
        case 12:
          updateMobileState.errors.mobile = '手机号码已存在';
          break;
        case 11:
          updateMobileState.errors.code = '手机动态码错误';
          break;
        default:
          updateMobileState.errors.server = '服务器错误';
          break;
        }
      }
      this.setState({updateMobileState});
    }
  }

  cancelUpdatingMobile() {
    this.setState({editingMobile: false});
  }

  getCaptcha() {
    this.setState({updateMobileState: Object.assign(this.state.updateMobileState, {captchaUrl: `/captcha.jpg/?r=${ Date.now()}`})});
  }

  async getCode() {
    const counting = (countdown) => {
      const updateMobileState = this.state.updateMobileState;
      updateMobileState.countdown = countdown;
      const donePromise = new Promise((resolve) => {
        const timeInterval = setInterval(() => {
          if (updateMobileState.countdown <= 0) {
            clearInterval(timeInterval);
            resolve();
          }
          updateMobileState.countdown--;
          this.setState({updateMobileState});
        }, 1000);
      });
      return donePromise;
    };

    const updateMobileState = this.state.updateMobileState;

    let valid = true;
    // reset error
    updateMobileState.errors = {};

    if (!validatePhone(updateMobileState.mobile)) {
      updateMobileState.errors.mobile = '手机号格式错误';
      valid = false;
    }

    if (updateMobileState.mobile === this.state.user.mobile) {
      updateMobileState.errors.mobile = '新手机号应与旧手机号不同';
      valid = false;
    }

    if (!validateRequired(updateMobileState.captcha)) {
      updateMobileState.errors.captcha = '请输入验证码';
      valid = false;
    }

    if (!updateMobileState.canResent || !valid) {
      return;
    }
    if (!updateMobileState.canResent) {
      return;
    }
    updateMobileState.canResent = false;
    updateMobileState.countdown = 60;

    this.setState({updateMobileState});

    try {
      await ajax.get('/api/auth/mobile_code/', {
        mobile: updateMobileState.mobile,
        type: 'modify',
        captcha: updateMobileState.captcha,
      });
      updateMobileState.captchaUrl = `/captcha.jpg/?r=${ Date.now()}`;
      this.setState({updateMobileState});
    } catch (err) {
      updateMobileState.canResent = true;
      if (err.error && err.error.errors) {
        err.error.errors.forEach((error) => {
          Object.assign(updateMobileState.errors, error);
        });
      }
      if (err.error && err.error.code === 6) {
        updateMobileState.errors.mobile = '手机号格式错误';
      }
      this.setState({updateMobileState});
      return;
    }

    await counting(60);

    updateMobileState.canResent = true;
    this.setState({updateMobileState});
  }

  renderErrorTip(error) {
    return error ? <div className="error-tip"><i className="icon-cuowutishi"></i>{error}</div> : '';
  }

  renderMobilePanel() {
    const {captchaUrl, mobile, captcha, code, canResent, countdown, errors} = this.state.updateMobileState;
    return (
      <div>
        <div className="form-group" key="1">
          <div className="sub-title">修改绑定手机</div>
        </div>
        <div className="form-group" key="2">
          <input className="form-control input-lg"
            value={mobile}
            placeholder="新手机"
            onChange={e=>{this.setState({updateMobileState: Object.assign(this.state.updateMobileState, {mobile: e.target.value})});}} />
          {this.renderErrorTip(errors.mobile)}
        </div>
        <div className="form-group" key="3">
          <input type="text"
            name="captcha"
            className="form-control input-lg captcha-input"
            placeholder="验证码"
            value={captcha}
            onChange={e=>{this.setState({updateMobileState: Object.assign(this.state.updateMobileState, {captcha: e.target.value})});}} />
          <a className="btn btn-default btn-o get-captcha-btn btn-lg pull-right">
            <img src={captchaUrl} className="captcha" onClick={this::this.getCaptcha} />
          </a>
          {this.renderErrorTip(errors.captcha)}
        </div>
        <div className="form-group" key="4">
          <input type="text"
            name="code"
            className="form-control input-lg code-input"
            placeholder="短信动态码"
            value={code}
            onChange={e => {this.setState({updateMobileState: Object.assign(this.state.updateMobileState, {code: e.target.value})});}} />
          {
            canResent ?
            <a className="btn btn-primary btn-o get-code-btn btn-lg pull-right"
              id="get-code-btn"
              onClick={this::this.getCode}>获取动态码</a> :
            <a className="btn btn-primary btn-o get-code-btn btn-lg pull-right" disabled="disabled">{countdown}</a>
          }
          {this.renderErrorTip(errors.code)}
        </div>
        <div className="form-group" key="5">
          <button onClick={this::this.updateMobile} className="btn btn-danger btn-lg confirm-btn">确认</button>
          {this.renderErrorTip(errors.server)}
        </div>
        <div className="form-group" key="6">
          <button onClick={this::this.cancelUpdatingMobile} className="btn btn-default btn-lg confirm-btn">返回</button>
        </div>
      </div>
    );
  }

  cancelUpdatingEmail() {
    this.setState({editingEmail: false});
  }

  async fetchUser() {
    const user = await ajax.get('/api/auth/me/');
    const updateEmailState = this.state.updateEmailState;
    updateEmailState.canResent = (new Date() - (user.lastEmailSentTime || 0)) > 3600 * 10000 ? true : false;
    this.setState({user, updateEmailState});
    this.oldUser = clone(user, true);
  }

  async updateEmail() {
    const updateEmailState = this.state.updateEmailState;
    const user = this.state.user;
    updateEmailState.errors = {};
    if (!validateEmail(updateEmailState.email)) {
      updateEmailState.errors.email = '邮箱格式错误';
      this.setState({updateEmailState});
      return;
    }
    try {
      // await ajax.post('/dtp/userlogin/modify_username/', {
      const result = await ajax.post('/api/auth/modify_username/', {
        modify_type: 'email',
        username: this.state.updateEmailState.email,
      });
      user.email = this.state.updateEmailState.email;
      this.oldUser = clone(user, true);
      this.setState({editingEmail: false, updateEmailState, user: result.result});
    } catch (err) {
      if (err.error) {
        switch (err.error.code) {
        case 12:
          updateEmailState.errors.mobile = '邮箱已存在';
          break;
        case 11:
          updateEmailState.errors.code = '手机动态码错误';
          break;
        default:
          break;
        }
      }
      this.setState({updateEmailState});
    }
  }

  renderEmailPanel() {
    const {email, errors} = this.state.updateEmailState;
    return (
      <div>
        <div className="form-group" key="8">
          <div className="sub-title">修改绑定邮箱</div>
        </div>
        <div className="form-group" key="9">
          <input className="form-control input-lg"
            value={email}
            placeholder="新邮箱"
            onChange={e=>{this.setState({updateEmailState: Object.assign(this.state.updateEmailState, {email: e.target.value})});}} />
          {this.renderErrorTip(errors.email)}
        </div>
        <div className="form-group" key="10">
          <button onClick={this::this.updateEmail} className="btn btn-danger btn-lg confirm-btn">确认</button>
          {this.renderErrorTip(errors.server)}
        </div>
        <div className="form-group" key="11">
          <button onClick={this::this.cancelUpdatingEmail} className="btn btn-default btn-lg confirm-btn">返回</button>
        </div>
      </div>
    );
  }

  async resendEmail() {
    const updateEmailState = this.state.updateEmailState;
    updateEmailState.errors = {};
    try {
      updateEmailState.canResent = false;
      this.setState({updateEmailState});
      await ajax.post('/api/auth/send_email');
    } catch (err) {
      if (err.error) {
        switch (err.error.code) {
        case 13:
          updateEmailState.errors.email = '邮箱不存在';
          break;
        case 12:
          updateEmailState.errors.email = '邮箱已存在';
          break;
        case 8:
          updateEmailState.errors.email = '邮件发送失败';
          break;
        default:
          updateEmailState.errors.server = '服务器错误';
          break;
        }
      }
      updateEmailState.canResent = true;
      this.setState({updateEmailState});
    }
  }

  renderProfile(avatar, nickname, email, mobile) {
    return (
      <div>
        <div className="form-group" key="12">
          <Avatar className="avatar-field" canEdit image={avatar || '/img/default_avatar.png'}
          />
        </div>
        <div className="form-group" key="13">
          <label>
            邮箱
            {
              !this.state.user.checkmail ?
              <span className="email-hint">
                <span className="badge">未验证</span>
                {
                  this.state.user.email && this.state.updateEmailState.canResent ?
                  <a className="btn-xs btn-link" onClick={this::this.resendEmail}>重发激活邮件</a> : ''
                }
              </span> :
              <span className="email-hint">
                <span className="badge badge-success">已验证</span>
              </span>
            }
          </label>
          <div className="static-field">
            {email}
          </div>
          <i className="icon-edit edit-icon icon-btn"
            title="修改"
            onClick={() => {this.setState({editingEmail: true});}}></i>
        </div>
        <div className="form-group" key="14">
          <label>手机</label>
          <div className="static-field">
            {mobile}
          </div>
          <i className="icon-edit edit-icon icon-btn"
            title="修改"
            onClick={() => {this.setState({editingMobile: true});}}></i>
        </div>
        <div className="form-group" key="15">
          <label>昵称</label>
          {
            this.state.editingNickname ?
            <div key="16">
              <input className="form-control input-lg nickname-input"
                value={nickname}
                onChange={e=>{this.setState({user: Object.assign(this.state.user, {nickname: e.target.value})});}}/>
              <i className="icon-tick confirm-nickname-icon icon-btn"
                title="确定"
                onClick={this::this.confirmNickname}></i>
              <i className="icon-times edit-icon icon-btn"
                title="取消"
                onClick={() => {
                  this.setState({user: clone(this.oldUser, true), editingNickname: false});
                }}></i>
            </div>
            :
            <div key="17">
              <div className="static-field">
                {nickname}
              </div>
              <i className="icon-edit edit-icon icon-btn"
                title="修改"
                onClick={()=>{this.setState({editingNickname: true});}}></i>
            </div>
          }
        </div>
      </div>
    );
  }

  render() {
    const {avatar_file, nickname, email, mobile} = this.state.user;
    return (
      <div className="content">
        {
          (() => {
            switch (true) {
            case this.state.editingMobile:
              return this.renderMobilePanel(mobile);
            case this.state.editingEmail:
              return this.renderEmailPanel(email);
            default:
              return this.renderProfile(avatar_file, nickname, email, mobile);
            }
          })()
        }
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

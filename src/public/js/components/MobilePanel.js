import React, {Component, PropTypes} from 'react';
import {actions} from '../redux/updateMobileState';
import {actions as viewActions} from '../redux/homeViewState';
import ErrorTip from './ErrorTip';

class MobilePanel extends Component {
  static propTypes = {
    updateMobileState: PropTypes.object,
    dispatch: PropTypes.func,
  };

  updateMobile() {
    this.props.dispatch(actions.updateUserMobile({
      mobile: this.refs.mobile.value,
      code: this.refs.code.value,
    }));
  }

  render() {
    const {captchaUrl, countdown, errors} = this.props.updateMobileState;
    const dispatch = this.props.dispatch;
    const canResent = countdown <= 0;
    return (
      <div>
        <div className="form-group" key="1">
          <div className="sub-title">修改绑定手机</div>
        </div>
        <div className="form-group" key="2">
          <input className="form-control input-lg"
            ref="mobile"
            placeholder="新手机" />
          <ErrorTip error={errors.mobile} />
        </div>
        <div className="form-group" key="3">
          <input type="text"
            name="captcha"
            ref="captcha"
            className="form-control input-lg captcha-input"
            placeholder="验证码" />
          <a className="btn btn-default-outline get-captcha-btn btn-lg pull-right">
            <img src={captchaUrl} className="captcha" onClick={() => dispatch(actions.changeCaptcha())} />
          </a>
          <ErrorTip error={errors.captcha} />
        </div>
        <div className="form-group" key="4">
          <input type="text"
            ref="code"
            className="form-control input-lg code-input"
            placeholder="短信动态码" />
          {
            canResent ?
            <a className="btn btn-primary-outline get-code-btn btn-lg pull-right"
              id="get-code-btn"
              onClick={() => dispatch(actions.getCode({
                mobile: this.refs.mobile.value,
                captcha: this.refs.captcha.value,
              }))}>获取动态码</a> :
            <a className="btn btn-primary-outline get-code-btn btn-lg pull-right" disabled="disabled">{countdown}</a>
          }
          <ErrorTip error={errors.code} />
        </div>
        <div className="form-group" key="5">
          <button onClick={this::this.updateMobile} className="btn btn-danger btn-lg confirm-btn">确认</button>
          <ErrorTip error={errors.server} />
        </div>
        <div className="form-group" key="6">
          <button onClick={() => dispatch(viewActions.changeView('SHOW_PROFILE'))}
            className="btn btn-default btn-lg confirm-btn">
            返回
          </button>
        </div>
      </div>
    );
  }
}

export default MobilePanel;

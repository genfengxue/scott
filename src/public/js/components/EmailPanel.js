import React, {Component, PropTypes} from 'react';
import {actions} from '../redux/updateEmailState';
import {actions as viewActions} from '../redux/homeViewState';
import ErrorTip from './ErrorTip';

class EmailPanel extends Component {
  static propTypes = {
    updateEmailState: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  };

  updateEmail() {
    this.props.dispatch(actions.updateUserEmail(this.refs.email.value));
  }

  render() {
    const {errors} = this.props.updateEmailState;
    const dispatch = this.props.dispatch;
    return (
      <div>
        <div className="form-group" key="8">
          <div className="sub-title">修改绑定邮箱</div>
        </div>
        <div className="form-group" key="9">
          <input className="form-control input-lg"
            ref="email"
            placeholder="新邮箱" />
          <ErrorTip error={errors.email} />
        </div>
        <div className="form-group" key="10">
          <button onClick={this::this.updateEmail} className="btn btn-danger btn-lg confirm-btn">确认</button>
          <ErrorTip error={errors.server} />
        </div>
        <div className="form-group" key="11">
          <button onClick={() => dispatch(viewActions.changeView('SHOW_PROFILE'))} className="btn btn-default btn-lg confirm-btn">返回</button>
        </div>
      </div>
    );
  }
}

export default EmailPanel;

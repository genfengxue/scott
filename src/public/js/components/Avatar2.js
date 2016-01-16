import React, {Component, PropTypes} from 'react';
import ajax from '../common/ajax';
import {actions} from '../redux/user';

class Avatar extends Component {
  static propTypes = {
    image: PropTypes.string,
    canEdit: PropTypes.bool,
    dispatch: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {};
  }

  onFileChange(e) {
    const files = e.target.files;
    if (files.length) {
      const req = ajax.request.post('/upload/image/');
      req.attach('file', files[0], files[0].name);
      req.end(async (err, data) => {
        if (err) {
          return;
        }
        // save
        this.props.dispatch(actions.updateUserAsync({avatar_file: data.text}));
      });
      e.target.value = null;
    }
  }

  mouseLeave() {
    this.setState({hover: false});
  }

  mouseEnter() {
    this.setState({hover: true});
  }

  render() {
    return (
      <div className="avatar"
        onMouseEnter={this::this.mouseEnter}
        onMouseLeave={this::this.mouseLeave}>
        <img src={this.props.image} />
          {this.props.canEdit ?
            <label htmlFor="avatar"
              className={'avatar-edit-btn ' + (this.state.hover ? 'hover' : '')}>
              <div><i className="icon-edit" title="修改头像"></i></div>
              <input type="file"
                id="avatar"
                onChange={this::this.onFileChange}
                style={{position: 'fixed', left: '9999px'}} />
            </label>
            : ''}
      </div>
    );
  }

}

export default Avatar;

import React, {Component, PropTypes} from 'react';
import ajax from '../common/ajax';
import event from '../common/eventAggregator';

class Avatar extends Component {
  static propTypes = {
    image: PropTypes.string,
    canEdit: PropTypes.bool,
  };

  constructor(props) {
    super();
    this.state = {image: props.image};
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
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
        try {
          const user = await ajax.put('/api/auth/me/', {avatar_file: data.text});
          event.emit('user', user);
          this.setState({image: data.text});
        } catch(error) {
          console.log(error);
        }
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
        <img src={this.state.image} />
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

import React, {Component, PropTypes} from 'react';
import Modal from 'react-modal';

const customStyles = {
  overlay: {
    zIndex: '1031',
    background: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    WebkitTransform: 'translate(-50%, -50%)',
    transform: 'translate(-50%, -50%)',
    padding: '0',
  },
};
class PronunciationModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func,
  };
  render() {
    return (
      <Modal
        {...this.props}
        style={customStyles}
        >
        <div className="modal-body">
          <a className="close" onClick={() => this.props.onRequestClose()}>
            <i className="icon-times" />
          </a>
          <p>
            Hi there~
          </p>
          <p>
            发音语调训练目前通过另外一款App进行
          </p>
          <p>
            你可以添加我的个人微信819432228来获得另外那款App
          </p>
          <p>
            我打算先开发其他功能，之后再把发音语调内容整合进来
          </p>
          <p>
            cheers, <br />
            Wind
          </p>
        </div>
      </Modal>
    );
  }

}

export default PronunciationModal;

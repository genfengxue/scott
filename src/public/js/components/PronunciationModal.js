import React, {Component, PropTypes} from 'react';
import Modal from 'react-modal';

const customStyles = {
  overlay: {
    zIndex: '1031',
    background: 'rgba(0, 0, 0, 0.6)',
    overflow: 'auto',
  },
  content: {
    // top: '50%',
    // left: '50%',
    // right: 'auto',
    // bottom: 'auto',
    // marginRight: '-50%',
    // WebkitTransform: 'translate(-50%, -50%)',
    // transform: 'translate(-50%, -50%)',
    top: '0.5rem',
    left: '2rem',
    right: '2rem',
    bottom: 'auto',
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
            我们的发音语调训练正在开发中, 预计4月下旬上线
            <br />
            如果你是付费学员, 请联系Wind老师获取临时的App
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

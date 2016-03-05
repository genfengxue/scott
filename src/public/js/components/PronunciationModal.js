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
            发音语调训练内容请到应用商店下载"流利学院"
          </p>
          <p>
            在"课程库"里边, "英语"类别最下边可以看到课程
          </p>

          <img src="/img/vocal.jpg" style={{width: '100%'}} />
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

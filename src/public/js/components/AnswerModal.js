import React, {Component, PropTypes} from 'react';
import Modal from 'react-modal';

const customStyles = {
  overlay: {
    zIndex: '1031',
    background: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    top: '3.5rem',
    left: '1rem',
    right: '1rem',
    bottom: 'auto',
    padding: '0',
  },
};

class AnswerModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func,
    children: PropTypes.array,
    title: PropTypes.string,
  };
  render() {
    return (
      <Modal
        {...this.props}
        style={customStyles}
        >
        <div className="modal-header">
          {this.props.title}
          <a className="close" onClick={() => this.props.onRequestClose()}>
            <i className="icon-times" />
          </a>
        </div>
        <div className="modal-body">
          {this.props.children}
        </div>
      </Modal>
    );
  }

}

export default AnswerModal;

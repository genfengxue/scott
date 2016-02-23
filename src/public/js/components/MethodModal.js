import React, {Component, PropTypes} from 'react';
import Modal from 'react-modal';

const customStyles = {
  overlay: {
    zIndex: '1031',
    background: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    top: '8rem',
    left: '2rem',
    right: '2rem',
    bottom: 'auto',
    padding: '0',
  },
};
class MethodModal extends Component {
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
          <h5>练听力方法:</h5>
          <p>每个句子听1-2遍并且跟读->看答案->听错的句子听1-5遍尽量听清<br/></p>
          <p>跟读可以让你节省做听写的时间, 还能让你练习发音语调<br/></p>

          <h5>练口语方法:</h5>
          <p>看中文说英文->对照答案->跟答案不一样的地方向答案学习<br/></p>
          <p>翻译可以让你练习遣词造句, 还能让你注意到许多不起眼的小错误<br/></p>

        </div>
      </Modal>
    );
  }

}

export default MethodModal;

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
class ReviewModal extends Component {
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
          <p>Hi there~</p>
          <br />
          <p>这个功能还没弄好╮(╯▽╰)╭</p>
          <p>如果跟读某个句子时没听懂, 翻译某个句子时说错了, 你可以把句子序号记录下来, 下次复习</p>
          <p>复习这个功能日后会有滴!</p>
          <br />
          cheers,
          <br />
          Wind
        </div>
      </Modal>
    );
  }

}

export default ReviewModal;

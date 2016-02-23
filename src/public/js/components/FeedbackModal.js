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

class FeedbackModal extends Component {
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
          <p>如果你练习时发现某个句子文本或音频有错, 比如:</p>
          <p>
            1 音频开头或结尾多了或少了个词 <br/>
            2 文本中有个错别字或者标点错误 <br/>
            3 或者任何别的错误
          </p>
          <p>请联系Wind老师个人微信819432228进行纠错</p>
          <p>纠错有奖励哦~</p>
          <br/>
          cheers,
          <br />
          Wind
        </div>
      </Modal>
    );
  }

}

export default FeedbackModal;

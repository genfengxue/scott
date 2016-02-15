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
class CollectionModal extends Component {
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
          Hi there~
          <br />
          咱们目前还不支持存档哈
          <br />
          如果你某课学到一半想下次再学
          <br />
          你可以点击微信右上角的...
          <br />
          然后选择"发送给朋友", 然后发给你自己
          <br />
          不要选择收藏
          <br />
          咱们后边会开发存档功能哈
          <br />
          Wind
        </div>
      </Modal>
    );
  }

}

export default CollectionModal;

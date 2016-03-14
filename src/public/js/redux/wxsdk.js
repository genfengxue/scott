import {createAction, handleActions} from 'redux-actions';
import ajax from '../common/ajax';

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVED_SIGNATURE = 'RECEIVED_SIGNATURE';
export const CLEAR_SIGNATURE = 'CLEAR_SIGNATURE';

// ------------------------------------
// Actions
// ------------------------------------
export const receivedSignature = createAction(RECEIVED_SIGNATURE, (payload) => payload);
export const clearSignature = createAction(CLEAR_SIGNATURE);

export const fetchSignatureAsync = () => {
  return async (dispatch) => {
    dispatch(clearSignature());
    let response;
    let retryTimes = 3;
    while (retryTimes > 0 && !response) {
      try {
        response = await ajax.get('/api/wechat/signature/');
        retryTimes--;
      } catch (err) {
        console.log('redux/wxsdk 26', err);
      }
    }
    if (response && response.signature) {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: response.appId, // 必填，公众号的唯一标识
        timestamp: response.timestamp, // 必填，生成签名的时间戳
        nonceStr: response.nonceStr, // 必填，生成签名的随机串
        signature: response.signature, // 必填，签名，见附录1
        jsApiList: ['startRecord', 'stopRecord', 'playVoice', 'onVoiceRecordEnd', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.ready(() => {
        dispatch(receivedSignature(response));
      });
      wx.error((res) => {
        console.log('redux/wxsdk 43', res);
        dispatch(fetchSignatureAsync());
      });
    } else {
      dispatch(receivedSignature());
      console.log('redux/wxsdk 48', 'signature error');
    }
  };
};

export const actions = {
  fetchSignatureAsync,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [RECEIVED_SIGNATURE]: (state, {payload}) => {
    return payload;
  },
  [CLEAR_SIGNATURE]: () => {
    return {};
  },
}, {});

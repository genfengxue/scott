import RedisCache from '../redis/RedisCache';
import request from './request';
import config from '../config/config';
import sha1 from 'sha1';

const accessTokenKey = `weixin_access_token_${config.weixin.appid}`;
const getAccessToken = async () => {
  let accessToken = await RedisCache.get(accessTokenKey);
  if (!accessToken) {
    const result = await request.get('https://api.weixin.qq.com/cgi-bin/token', {
      'grant_type': 'client_credential',
      'appid': config.weixin.appid,
      'secret': config.weixin.secret,
    });
    accessToken = result.access_token;
    await RedisCache.set(accessTokenKey, accessToken, result.expires_in);
  }
  return accessToken;
};

const jsapiTicketKey = `weixin_jsapi_ticket_${config.weixin.appid}`;
const getJsapiTicket = async () => {
  const accessToken = await getAccessToken();
  let jsapiTicket = await RedisCache.get(jsapiTicketKey);
  if (!jsapiTicket) {
    const result = await request.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`);
    jsapiTicket = result.ticket;
    await RedisCache.set(jsapiTicketKey, jsapiTicket, result.expires_in);
  }
  return jsapiTicket;
};

/**
 * get wechat jssdk signature
 * @param noncestr
 * @param timestamp (Unix timestamp, 1/1000 of javascript timestamp)
 * @param url (do not encode)
 * @returns signature
 */
const getSignature = async (noncestr, timestamp, url) => {
  const jsapiTicket = await getJsapiTicket();
  const input = `jsapi_ticket=${jsapiTicket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
  return sha1(input);
};

const reset = async () => {
  await RedisCache.set(accessTokenKey, '');
  await RedisCache.set(jsapiTicketKey, '');
}

export default {
  getAccessToken,
  getJsapiTicket,
  getSignature,
  reset,
};

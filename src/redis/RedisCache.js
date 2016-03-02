import redis from './index';
import logger from '../utils/logger';

class RedisCache {

  /**
   * get value by key
   * @param key string
   * @returns {*} value | null
   */
  static async get(key) {
    const time = new Date();
    let data;
    try {
      data = await redis.get(key);
      const duration = (new Date() - time);
      logger.debug('redis cache get *' + key + '*' + duration + 'ms');
      return JSON.parse(data);
    } catch (error) {
      logger.fatal(error);
      return null;
    }
  }

  /**
   * set key-value or add expire
   * @param key
   * @param value
   * @param expire cache expire in seconds
   * @returns {*} ok | ''
   */
  static async set(key, value, expire) {
    const time = new Date();
    const strValue = JSON.stringify(value);
    let bkSet;
    try {
      if (!expire) {
        bkSet = await redis.set(key, strValue);
      } else {
        bkSet = await redis.setex(key, expire, strValue);
      }
      const duration = (new Date() - time);
      logger.debug('redis cache set *' + key + '*' + duration + 'ms');
      return bkSet;
    } catch (error) {
      logger.fatal(error);
      return '';
    }
  }
}

export default RedisCache;

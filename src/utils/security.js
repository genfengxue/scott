import fs from 'fs';
import ursa from 'ursa';
import config from '../config/config';

const getUserHome = () => {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
};

const key = ursa.createPrivateKey(fs.readFileSync(`${getUserHome()}/.ssh/${config.rsa.privatePem}`));
const crt = ursa.createPublicKey(fs.readFileSync(`${getUserHome()}/.ssh/server.pub`));

console.log('Encrypt with Private (called public)');
let msg = key.privateEncrypt('Security OK', config.rsa.charset, config.rsa.encoding);
console.log('encrypted', msg, '\n');

console.log('Decrypt with Public (called private)');
msg = crt.publicDecrypt(msg, config.rsa.encoding, config.rsa.charset);
console.log('decrypted', msg, '\n');

const encrypt = (text) => {
  if (text) {
    return key.privateEncrypt(text, config.rsa.charset, config.rsa.encoding);
  }
  return '';
};

const decrypt = (decrypted) => {
  try {
    if (decrypted) {
      return crt.publicDecrypt(decrypted, config.rsa.encoding, config.rsa.charset);
    }
    return '';
  } catch (err) {
    console.log(err);
    return '';
  }
};

export default {
  encrypt,
  decrypt
};

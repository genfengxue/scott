import {MOBILE_REG, EMAIL_REG} from '../../../common/regex';

export const stripPhoneNumber = (mobile) => {
  // 086 +86 86 - , . /
  let stripped = mobile.toString();
  stripped = stripped.replace(/\.|\/|-|,|\+/g, '');
  if (stripped.indexOf('86') === 0) {
    stripped = stripped.substr(2);
  }
  if (stripped.indexOf('086') === 0) {
    stripped = stripped.substr(3);
  }
  return stripped;
};

export const validatePhone = (mobile) => {
  if (!mobile) {
    return false;
  }
  if (!MOBILE_REG.test(mobile)) {
    return false;
  }
  return true;
};

export const validateRequired = (input) => {
  const stripped = input.replace(/\s/g, '');
  if (!stripped) {
    return false;
  }
  return true;
};

export const validateAccount = (account) => {
  if (!account) {
    return false;
  }
  const isPhoneNumber = MOBILE_REG.test(account);
  const isEmail = EMAIL_REG.test(account);
  // strip 086, 86, +86,
  if (!isPhoneNumber && !isEmail) {
    return false;
  }
  return true;
};

export const validateEmail = (email) => {
  if (!email) {
    return false;
  }
  if (!EMAIL_REG.test(email)) {
    return false;
  }
  return true;
};

export const validatePassword = (password) => {
  const trimed = password.trim();
  if (!trimed) {
    return false;
  }
  if (trimed.length < 6) {
    return false;
  }
  return true;
};

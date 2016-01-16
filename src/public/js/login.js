import $ from 'jquery';
import jqueryPlaceholder from 'jquery-placeholder'; // eslint-disable-line no-unused-vars
import babelPolyfill from 'babel-polyfill'; // eslint-disable-line no-unused-vars
import qs from 'qs';

$('input, textarea').placeholder({customClass: 'my-placeholder'});

$.ajaxPrefilter((options) => {
  if (!options.beforeSend) {
    options.beforeSend = (xhr) => {
      xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
    };
  }
});

// consts
const MOBILE_REG = /(^(13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7})$/;
const EMAIL_REG = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

// $ elements
const getCodeBtn = $('#get-code-btn');
const mobileInput = $('#mobile-input');
const codeInput = $('#code-input');
const accountInput = $('#account-input');
const passwordInput = $('#password-input');
const loginForm = $('#login-form');
const loading = $('.loading');

// validations: will check value, update display, return valid or not
const displayError = (element, message) => {
  const errorSpan = $(element.selector + '-error');
  errorSpan.html(message);
  errorSpan.show();
};

const hideError = (element) => {
  const errorSpan = $(element.selector + '-error');
  errorSpan.hide();
};

const validatePhone = () => {
  const mobile = mobileInput.val();
  if (!mobile) {
    displayError(mobileInput, '<i class="icon-cuowutishi"></i> 请输入手机号');
    return false;
  }
  if (!MOBILE_REG.test(mobile)) {
    displayError(mobileInput, '<i class="icon-cuowutishi"></i> 手机号格式错误');
    return false;
  }
  hideError(mobileInput);
  return true;
};

const validateCode = () => {
  if (!codeInput.val()) {
    displayError(codeInput, '<i class="icon-cuowutishi"></i> 请输入验证码');
    return false;
  }
  hideError(codeInput);
  return true;
};

const validateAccount = () => {
  const account = accountInput.val();
  if (!account) {
    displayError(accountInput, '<i class="icon-cuowutishi"></i> 请输入账号');
    return false;
  }
  const isPhoneNumber = MOBILE_REG.test(account);
  const isEmail = EMAIL_REG.test(account);
  // strip 086, 86, +86,
  if (!isPhoneNumber && !isEmail) {
    displayError(accountInput, '<i class="icon-cuowutishi"></i> 请输入正确格式的手机号码或邮箱');
    return false;
  }
  hideError(accountInput);
  return true;
};

const validatePassword = () => {
  if (!passwordInput.val()) {
    displayError(passwordInput, '<i class="icon-cuowutishi"></i> 请输入密码');
    return false;
  }
  hideError(passwordInput);
  return true;
};


let canResent = true;

const updateDisplay = (countdown) => {
  if (canResent) {
    getCodeBtn.html('获取动态码');
    getCodeBtn.attr('disabled', false);
  } else {
    getCodeBtn.html(countdown + '秒');
    getCodeBtn.attr('disabled', true);
  }
};

const counting = (countdown) => {
  const donePromise = new Promise((resolve) => {
    const timeInterval = setInterval(() => {
      if (countdown <= 0) {
        clearInterval(timeInterval);
        resolve();
      }
      countdown--;
      updateDisplay(countdown);
    }, 1000);
  });
  return donePromise;
};

// handles
getCodeBtn.on('click', async () => {
  // check mobile
  let valid = true;
  hideError(mobileInput);
  if (!validatePhone(mobileInput.val())) {
    displayError(mobileInput, '<i class="icon-cuowutishi"></i> 手机号格式错误');
    valid = false;
  }

  if (!canResent || !valid) {
    return;
  }
  if (!canResent) {
    return;
  }
  canResent = false;
  updateDisplay(60);

  try {
    await $.get('/api/auth/mobile_code/', {mobile: mobileInput.val(), type: 'login'});
  } catch (err) {
    canResent = true;
    updateDisplay();
    if (err.responseJSON.error.code === 6) {
      displayError(mobileInput, '<i class="icon-cuowutishi"></i> 手机号格式错误');
    }
    if (err.responseJSON.error.code === 13) {
      displayError(mobileInput, '<i class="icon-cuowutishi"></i> 手机号未注册');
    }
    return;
  }

  try {
    await counting(60);
  } catch (err) {
    console.log(err);
  }
  canResent = true;
  updateDisplay();
});

loginForm.on('submit', (e) => {
  e.preventDefault();
  const formDataStr = loginForm.serialize();
  const formData = qs.parse(formDataStr);
  hideError(mobileInput);
  hideError(codeInput);
  // validate
  let valid = false;
  if (formData.type === 'mobile') {
    // We need to proceed all the validations, thus, we should use single '&'
    valid = validatePhone() & validateCode();
  } else {
    valid = validateAccount() & validatePassword();
  }
  if (valid) {
    loading.show();
    $.post('/api/auth/login', formData)
    .then((data) => {
      window.location.href = data.redirect || '';
    }, (err) => {
      loading.hide();
      switch (err.responseJSON.error.code) {
      case 7:
        displayError(codeInput, '<i class="icon-cuowutishi"></i> 验证码错误');
        break;
      case 5:
        displayError(accountInput, '<i class="icon-cuowutishi"></i> 用户名或密码错误');
        break;
      default:
        break;
      }
    });
  } else {
    return;
  }
});

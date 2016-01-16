import $ from 'jquery';
import jqueryPlaceholder from 'jquery-placeholder'; // eslint-disable-line no-unused-vars
import babelPolyfill from 'babel-polyfill'; // eslint-disable-line no-unused-vars
import qs from 'qs';
import {validateEmail, validatePhone, validatePassword, validateRequired} from './common/validations';

$('input, textarea').placeholder({customClass: 'my-placeholder'});

$.ajaxPrefilter((options) => {
  if (!options.beforeSend) {
    options.beforeSend = (xhr) => {
      xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
    };
  }
});

// consts

// $ elements
const getCodeBtn = $('#get-code-btn');
const getCaptchaBtn = $('#get-captcha-btn');
const mobileInput = $('#mobile-input');
const codeInput = $('#code-input');
const captchaInput = $('#captcha-input');
const passwordInput = $('#password-input');
const registerForm = $('#register-form');
const loading = $('.loading');
const emailInput = $('#email-input');
const confirmPasswordInput = $('#confirm-password-input');
const captcha = $('#captcha');

const displayError = (element, message) => {
  const selector = element.selector;
  const errorSpan = $(selector + '-error');
  errorSpan.html(message);
  errorSpan.show();
};

const hideError = (element) => {
  const selector = element.selector;
  const errorSpan = $(selector + '-error');
  errorSpan.hide();
};

// captcha *********************************************************************

// handles
getCaptchaBtn.on('click', () => {
  const captchaUrl = '/captcha.jpg';
  captcha.attr('src', `${captchaUrl}?r=${Date.now()}`);
});
// end of captcha --------------------------------------------------------------

// mobile code ******************************************************************
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
  let remain = countdown;
  const donePromise = new Promise((resolve) => {
    const timeInterval = setInterval(() => {
      if (remain <= 0) {
        clearInterval(timeInterval);
        resolve();
      }
      remain--;
      updateDisplay(remain);
    }, 1000);
  });
  return donePromise;
};

// handles
getCodeBtn.on('click', async () => {
  // check mobile
  let valid = true;
  hideError(captchaInput);
  hideError(mobileInput);
  if (!validatePhone(mobileInput.val())) {
    displayError(mobileInput, '<i class="icon-cuowutishi"></i> 手机号格式错误');
    valid = false;
  }
  if (!validateRequired(captchaInput.val())) {
    displayError(captchaInput, '<i class="icon-cuowutishi"></i> 请输入验证码');
    valid = false;
  }

  if (!canResent || !valid) {
    return;
  }

  try {
    await $.get('/api/auth/mobile_code/', {mobile: mobileInput.val(), captcha: captchaInput.val().trim(), type: 'register'});
    canResent = false;
    updateDisplay(60);
  } catch (err) {
    displayError(captchaInput, '<i class="icon-cuowutishi"></i> 验证码错误');
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
// end of mobile code -----------------------------------------------------------

registerForm.on('submit', (e) => {
  e.preventDefault();
  const formDataStr = registerForm.serialize();
  const formData = qs.parse(formDataStr);

  // validate
  let valid = false;
  valid = validateForm(formData);
  if (valid) {
    loading.show();
    $.post('/api/auth/register', formData)
    .then((data) => {
      window.location.href = data.redirect;
    }, (err) => {
      loading.hide();
      const errorCode = err.responseJSON.error.code;
      switch (errorCode) {
      case 7:
        displayError(codeInput, '<i class="icon-cuowutishi"></i> 验证码错误');
        break;
      case 5:
        displayError(emailInput, '<i class="icon-cuowutishi"></i> 用户名或密码错误');
        break;
      case 6:
        displayError(emailInput, '<i class="icon-cuowutishi"></i> 请输入正确的邮箱');
        displayError(mobileInput, '<i class="icon-cuowutishi"></i> 请输入正确的手机号');
        break;
      case 12:
        displayError(mobileInput, '<i class="icon-cuowutishi"></i> 手机号码已存在');
        displayError(emailInput, '<i class="icon-cuowutishi"></i> 邮箱已存在');
        break;
      default:
        break;
      }
    });
  } else {
    return;
  }
});

// 控制页面效果
const validateForm = (data) => {
  let valid = true;
  if (data.type === 'mobile') {
    if (!mobileInput.val()) {
      displayError(mobileInput, '<i class="icon-cuowutishi"></i> 请输入手机号');
      valid = false;
    } else if (!validatePhone(mobileInput.val())) {
      displayError(mobileInput, '<i class="icon-cuowutishi"></i> 手机号格式错误');
      valid = false;
    } else {
      hideError(mobileInput);
    }
    if (!passwordInput.val()) {
      displayError(passwordInput, '<i class="icon-cuowutishi"></i> 请输入密码');
      valid = false;
    } else if (!validatePassword(passwordInput.val())) {
      displayError(passwordInput, '<i class="icon-cuowutishi"></i> 密码格式不符合要求');
      valid = false;
    } else {
      hideError(passwordInput);
    }
    if (!codeInput.val()) {
      displayError(codeInput, '<i class="icon-cuowutishi"></i> 请输入短信动态码');
      valid = false;
    } else {
      hideError(codeInput);
    }
  } else {
    if (!emailInput.val()) {
      displayError(emailInput, '<i class="icon-cuowutishi"></i> 请输入邮箱');
      valid = false;
    } else if (!validateEmail(emailInput.val())) {
      displayError(emailInput, '<i class="icon-cuowutishi"></i> 邮箱格式错误');
      valid = false;
    } else {
      hideError(emailInput);
    }
    if (!passwordInput.val()) {
      displayError(passwordInput, '<i class="icon-cuowutishi"></i> 请输入密码');
      valid = false;
    } else if (!validatePassword(passwordInput.val())) {
      displayError(passwordInput, '<i class="icon-cuowutishi"></i> 密码格式不符合要求');
      valid = false;
    } else {
      hideError(passwordInput);
    }
    if (!confirmPasswordInput.val()) {
      displayError(confirmPasswordInput, '<i class="icon-cuowutishi"></i> 请再次输入密码');
      valid = false;
    } else if (confirmPasswordInput.val() !== confirmPasswordInput.val()) {
      displayError(confirmPasswordInput, '<i class="icon-cuowutishi"></i> 两次密码输入不一致');
      valid = false;
    } else {
      hideError(confirmPasswordInput);
    }
  }
  return valid;
};

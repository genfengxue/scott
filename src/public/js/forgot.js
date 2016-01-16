import $ from 'jquery';
import jqueryPlaceholder from 'jquery-placeholder'; // eslint-disable-line no-unused-vars
import babelPolyfill from 'babel-polyfill'; // eslint-disable-line no-unused-vars
import qs from 'qs';
import {validateEmail, validatePhone, validatePassword, validateRequired} from './common/validations';
import template from 'lodash/string/template';

$('input, textarea').placeholder({customClass: 'my-placeholder'});

$.ajaxPrefilter(function( options ) {
  if (!options.beforeSend) {
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
    }
  }
});

// consts
const interpolate = /{{([\s\S]+?)}}/g;

// $ elements
let getCodeBtn = $('#get-code-btn');
let getCaptchaBtn = $('#get-captcha-btn');
let mobileInput = $('#mobile-input');
let codeInput = $('#code-input');
let captchaInput = $('#captcha-input');
let accountInput = $('#account-input');
let passwordInput = $('#password-input');
let forgotForm = $('#forgot-form');
let loading = $('.loading');
let emailInput = $('#email-input');
let confirmPasswordInput = $('#confirm-password-input');
let captcha = $('#captcha');
let nextBtn = $('#next-btn');

const displayError = (element, message) => {
  const selector = element.selector;
  let errorSpan = $(element.selector + '-error');
  errorSpan.html(message);
  errorSpan.show();
}

const hideError = (element) => {
  const selector = element.selector;
  let errorSpan = $(element.selector + '-error');
  errorSpan.hide();
}

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
    getCodeBtn.attr("disabled", false);
  } else {
    getCodeBtn.html(countdown + '秒');
    getCodeBtn.attr("disabled", true);
  }
}

const counting = (countdown) => {
  const donePromise = new Promise((resolve) => {
    const timeInterval = setInterval(() => {
      if(countdown <= 0){
        clearInterval(timeInterval);
        resolve();
      }
      countdown--;
      updateDisplay(countdown);
    }, 1000);
  });
  return donePromise;
}

// handles
const getCode = async () => {
  // check mobile
  let valid = true;
  hideError(accountInput);
  if (!validatePhone(accountInput.val())) {
    displayError(accountInput, '<i class="icon-cuowutishi"></i> 手机号格式错误');
    valid = false;
  }
  if (!canResent || !valid) {
    return;
  }

  try {
    await $.get('/api/auth/mobile_code/', {mobile: accountInput.val(), type: 'retrieve'});
    canResent = false;
    updateDisplay(60);
  } catch (err) {
    displayError(codeInput, '<i class="icon-cuowutishi"></i> 电话号码不存在');
    return;
  }

  try {
    await counting(60);
  } catch (err) {
    console.log(err);
  }
  canResent = true;
  updateDisplay();
}
// end of mobile code -----------------------------------------------------------

let type = '';
nextBtn.on('click', async (e) => {
  e.preventDefault();
  // reset
  hideError(accountInput);
  const account = accountInput.val();

  // validate
  if (!account) {
    displayError(accountInput, '<i class="icon-cuowutishi"></i> 请输入手机号或者邮箱');
    return;
  } else if (validatePhone(account)) {
    // mobile
    type = 'mobile';
  } else if (validateEmail(account)) {
    // email
    type = 'email';
  } else {
    displayError(accountInput, '<i class="icon-cuowutishi"></i> 手机号或者邮箱格式错误');
    return;
  }

  if (type === 'mobile') {
    // send pollcode
    try {
      await $.get('/api/auth/mobile_code/', {mobile: account, type: 'retrieve'});
    } catch (err) {
      displayError(accountInput, '<i class="icon-cuowutishi"></i> 电话号码不存在');
      return;
    }

    $('.account-part').addClass('hide');
    const html = template($('#mobile-part-tmpl').html(), {interpolate})();
    $('.account-part').after($(html));

    getCodeBtn = $('#get-code-btn');
    getCodeBtn.on('click', getCode);
    codeInput = $('#code-input');
    passwordInput = $('#password-input');
    confirmPasswordInput = $('#confirm-password-input');

    canResent = false;
    updateDisplay(60);

    try {
      await counting(60);
    } catch (err) {
      console.log(err);
    }
    canResent = true;
    updateDisplay();
  } else {
    // send email
    try {
      await $.get('/api/auth/retrieve_send_email/', {email: account});
    } catch (err) {
      displayError(accountInput, '<i class="icon-cuowutishi"></i> 邮箱不存在');
      return;
    }

    $('.account-part').addClass('hide');
    const html = template($('#email-part-tmpl').html(), {interpolate})({email: account});
    $('.account-part').after($(html));
  }
});

forgotForm.on('submit', (e) => {
  e.preventDefault();
  if (!$('.account-part').hasClass('hide')) {
    return;
  }
  const formDataStr = forgotForm.serialize();
  const formData = qs.parse(formDataStr);
  formData.type = type;
  // validate
  let valid = false;
  valid = validateForm(formData);
  if (valid) {
    loading.show();
    $.post('/api/auth/forgot', formData)
    .then((data) => {
      loading.hide();
      window.location.href = '/login/?type=' + type;
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
  if (type === 'mobile') {
    if (!accountInput.val()) {
      displayError(accountInput, '<i class="icon-cuowutishi"></i> 请输入手机号');
      valid = false;
    } else if (!validatePhone(accountInput.val())) {
      displayError(accountInput, '<i class="icon-cuowutishi"></i> 手机号格式错误');
      valid = false;
    } else {
      hideError(accountInput);
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
    if (!confirmPasswordInput.val()) {
      displayError(confirmPasswordInput, '<i class="icon-cuowutishi"></i> 请再次输入密码');
      valid = false;
    } else if (confirmPasswordInput.val() !== confirmPasswordInput.val()) {
      displayError(confirmPasswordInput, '<i class="icon-cuowutishi"></i> 两次密码输入不一致');
      valid = false;
    } else {
      hideError(confirmPasswordInput);
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
}




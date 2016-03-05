/**
 * author      : cagegong cagegong@gmail.com
 * date        : 02/03/2016
 * description : 微信页面动态设置title
 */

let lastTitle = '';

/**
 * Set page title in wechat webview.
 * @param {String} title the new title for the current page
 */
export default (title) => {
  if (title === lastTitle) {
    return;
  }
  lastTitle = title;
  const body = document.body;
  document.title = title; // hack在微信等webview中无法修改document.title的情况
  const $iframe = document.createElement('iframe');
  $iframe.src = '/iframe';
  $iframe.style.display = 'none';
  $iframe.onload = () => {
    setTimeout(() => {
      $iframe.onload = null;
      body.removeChild($iframe);
    }, 0);
  };
  body.appendChild($iframe);
};

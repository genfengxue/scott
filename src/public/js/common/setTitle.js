export default (title) => {
  const body = document.body;
  document.title = title; // hack在微信等webview中无法修改document.title的情况
  const $iframe = document.createElement('iframe');
  $iframe.src = '/favicon.ico';
  $iframe.style.display = 'none';
  $iframe.onload = () => {
    setTimeout(() => {
      $iframe.onload = null;
      body.removeChild($iframe);
    }, 0);
  };
  body.appendChild($iframe);
};

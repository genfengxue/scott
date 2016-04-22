// remote log system
(function(console) {
  let methods;
  if (/localhost/.test(window.location.hostname)) {
    console.remote = console.log;
    return;
  }
  methods = ['log', 'error', 'remote'];
  methods.map(function(method) {
    let oldFn;
    oldFn = console[method];
    console[method] = function() {
      let xmlhttp;
      if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
      } else {
        xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
      }
      xmlhttp.open('POST', 'http://airlog.learnwithwind.com/log/scott', true);
      xmlhttp.setRequestHeader('Accept', '*');
      xmlhttp.setRequestHeader('Content-Type', 'application/json');
      try {
        xmlhttp.send(JSON.stringify(Array.prototype.slice.call(arguments)));
      } catch (e) {
        xmlhttp = null;
      }
      return oldFn && oldFn.apply ? oldFn.apply(console, arguments) : void 0;
    };
  });
})(console);

(function(window) {
  let preErrorHander;
  preErrorHander = window.onerror;
  window.onerror = function(m, u, l, c, e) {
    if (typeof preErrorHander === 'function') {
      preErrorHander(m, u, l, c, e);
    }
    console.remote(location.href, 'error', 'onJSError', m, u, l, c, e.toString());
  };
})(window);

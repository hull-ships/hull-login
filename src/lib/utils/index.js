const NOOP = function NOOP() {};

function preloadImage(src, callback) {
  const cb = (typeof callback === 'function') ? callback : NOOP;
  if (src) {
    const image = new Image();
    image.onerror = ()=> cb(new Error('Image load error'));
    image.onabort = ()=> cb(new Error('Image load abort'));
    image.onload = ()=> cb(null, image);
    image.src = src;
  } else {
    return cb(new Error('Empty SRC'));
  }
}

function parseQueryString(queryString) {
  queryString = queryString || document.location.search;

  const params = {};
  queryString.replace(/([^?=&]+)(=([^&]*))?/g, function($0, $1, $2, $3) {
    params[$1] = $3;
  });

  return params;
}

export default {
  preloadImage,
  parseQueryString,
};

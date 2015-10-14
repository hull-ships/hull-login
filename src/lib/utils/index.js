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

export default {
  preloadImage,
};

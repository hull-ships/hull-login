const NOOP = function NOOP() {};

export default function preloadImage(src, callback) {
  let cb = (typeof callback === 'function') ? callback : NOOP;
  if (src) {
    let image = new Image();
    image.onerror = ()=> cb(new Error('Image load error'));
    image.onabort = ()=> cb(new Error('Image load abort'));
    image.onload = ()=> cb(null, image);
    image.src = src;
  } else {
    return cb(new Error('Empty SRC'));
  }
}

import MessageFormat from 'messageformat';

let _initialized = false;
let _translations = {};
let _locale = 'en';
let _messages = {};

function compileMessages() {
  _messages = {};

  let mf = new MessageFormat(_locale);

  for (let k in _translations[_locale]) {
    if (_translations[_locale].hasOwnProperty(k)) {
      _messages[k] = mf.compile(_translations[_locale][k]);
    }
  }
}

function setTranslations(translations) {
  _translations = translations;
  _initialized = true;
  compileMessages();
}

function setLocale(locale) {
  _locale = locale;

  compileMessages();
}

function translate(message, data) {
  if (!_initialized) {
    console.warn('[i18n] translations not initialized yet - translating "' + message + '"'); // eslint-disable-line
    return message;
  }

  let m = _messages[message];

  if (m == null) {
    console.warn('[i18n] "' + message + '". is missing in "' + _locale + '".'); // eslint-disable-line

    let mf = new MessageFormat(_locale);
    m = _messages[message] = mf.compile(message);
  }

  try {
    return m(data);
  } catch (e) {
    console.error('[i18n] Cannot translate "' + message + '". ' + e.message); // eslint-disable-line

    return '[error] ' + message;
  }
}


function hasTranslation(message) {
  return !!_messages[message];
}

export default { setTranslations, setLocale, translate, hasTranslation };

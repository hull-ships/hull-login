import MessageFormat from 'messageformat';

let _initialized = false;
let _translations = {};
let _locale = 'en';
let _messages = {};

function compileMessages() {
  _messages = {};

  const mf = new MessageFormat(_locale);

  for (const k in _translations[_locale]) {
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

  const m = _messages[message];

  if (!m) {
    console.warn('[i18n] "' + message + '". is missing in "' + _locale + '".'); // eslint-disable-line
  } else {
    try {
      return m(data);
    } catch (e) {
      console.error('[i18n] Cannot translate "' + message + '". ' + e.message); // eslint-disable-line
    }
  }
}

function hasTranslation(message) {
  return !!_messages[message];
}

export default {
  setLocale,
  setTranslations,
  translate,
  hasTranslation,
};

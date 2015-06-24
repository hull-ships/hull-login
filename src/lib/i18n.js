import IntlMessageFormat from 'intl-messageformat';

let _translations = {};
let _locale = 'en';
let _messages = {};

function compileMessages() {
  _messages = {};

  for (let k in _translations[_locale]) {
    if (_translations[_locale].hasOwnProperty(k)) {
      _messages[k] = new IntlMessageFormat(_translations[_locale][k], _locale);
    }
  }
}

function setTranslations(translations) {
  _translations = translations;

  compileMessages();
}

function setLocale(locale) {
  _locale = locale;

  compileMessages();
}

function translate(message, data) {
  let m = _messages[message];

  if (m == null) {
    console.warn('[i18n] "' + message + '". is missing in "' + _locale + '.json".'); // eslint-disable-line
    m = _messages[message] = new IntlMessageFormat(message, _locale);
  }

  try {
    return m.format(data);
  } catch (e) {
    console.error('[i18n] Cannot translate "' + message + '". ' + e.message); // eslint-disable-line

    return '[error] ' + message;
  }
}

export default {
  setTranslations: setTranslations,
  setLocale: setLocale,
  translate: translate
};


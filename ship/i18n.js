import IntlMessageFormat from 'intl-messageformat';

var _translations = {};
var _locale = 'en';
var _messages = {};

function compileMessages() {
  _messages = {};

  for (var k in _translations[_locale]) {
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
  var m = _messages[message];

  if (m == null) {
    console.warn('[i18n] "' + message + '". is missing in "' + _locale + '.json".');
    m = _messages[message] = new IntlMessageFormat(message, _locale);
  }

  try {
    return m.format(data);
  } catch (e) {
    console.error('[i18n] Cannot translate "' + message + '". ' + e.message);

    return '[error] ' + message;
  }
}

export default {
  setTranslations: setTranslations,
  setLocale: setLocale,
  translate: translate
};


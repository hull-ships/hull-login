'use strict';

import color from 'color';
import { getSettings } from './settings';

function getStyles() {
  const settings = getSettings();

  const reset = {
    WebkitBoxSizing: 'content-box',
    MozBoxSizing: 'content-box',
    boxSizing: 'content-box',

    width: 'auto',
    minWidth: 0,
    maxWidth: 'none',
    height: 'auto',
    minHeight: 0,
    maxHeight: 'none',
    margin: 0,
    padding: 0,
    border: 0,
    outlineWidth: 0,

    position: 'static',
    right: 'auto',
    top: 'auto',
    left: 'auto',
    bottom: 'auto',
    zIndex: 'auto',

    clear: 'none',
    'float': 'none',
    overflow: 'visible',

    opacity: 1,

    whiteSpace: 'normal',

    cursor: 'auto',

    letterSpacing: 'normal',

    verticalAlign: 'baseline',

    borderRadius: 0,

    boxShadow: 'none',

    color: settings.textColor,

    background: 'none',
    backgroundColor: 'transparent',
    backgroundImage: 'none',

    fontFamily: settings.defaultFontFamily,
    fontSize: settings.defaultFontSize,
    fontSizeAjust: 'none',
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: 'normal',

    lineHeight: settings.defaultLineHeight,

    textAlign: 'left',
    textDecoration: 'none',
    textShadow: 'none',
    textTransform: 'none',

    WebkitAnimation: 'none',
    MozAnimation: 'none',
    MsAnimation: 'none',
    animation: 'none',

    WebkitTranstion: 'none',
    MozTranstion: 'none',
    MsTranstion: 'none',
    transtion: 'none',

    WebkitAppearance: 'none',
    MozAppearance: 'none',

    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
  };

  const link = {
    cursor: 'pointer',
    color: settings.linkColor,
    background: 'transparent',
    textDecoration: 'underline',
    outlineWidth: 5
  };

  const linkHover = {
    color: color(settings.linkColor).darken(0.2).hexString()
  };

  const linkFocus = {
    color: color(settings.linkColor).darken(0.2).hexString()
  };

  const placeholder = {
    color: settings.grayColor
  };

  return {
    reset,
    link,
    linkHover,
    linkFocus,
    placeholder
  };
}

export default {
  getStyles
};

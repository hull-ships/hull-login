'use strict';

import color from 'color';
import { getSettings } from '../../styles/settings';

const KINDS = [
  'primary',
  'secondary',
  'tertiary',
  'facebook',
  'foursquare',
  'github',
  'google',
  'instagram',
  'linkedin',
  'soundcloud',
  'tumblr',
  'twitter',
  'vkontakte'
];

function getStyles() {
  const settings = getSettings();

  const button = {
    display: 'inline-block',
    boxSizing: 'border-box',
    border: 'none',
    outline: 'none',
    borderRadius: settings.defaultBorderRadius,
    color: settings.whiteColor,
    cursor: 'pointer',
    fontFamily: settings.defaultFontFamily,
    fontSize: settings.defaultFontSize,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecoration: 'none',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    lineHeight: '22px',
    paddingTop: 7,
    paddingRight: 14,
    paddingBottom: 7,
    paddingLeft: 14,
    WebkitAppearance: 'none',
    WebkitFontSmoothing: 'antialiased',
    textShadow: '0 -1px 0 rgba(0,0,0,.15)',
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.04), inset 0 -1px 0 0 rgba(0,0,0,.08), 0 1px 1px 0 rgba(0,0,0,.1)',

    modifiers: [
      {
        kind: KINDS.reduce(function(m, p) {
          var normalHex = settings[`${p}Color`];
          var normal = color(normalHex);

          m[p] = {
            backgroundColor: normalHex,
            backgroundImage: `linear-gradient(rgba(255,255,255,.03), rgba(255,255,255,0))`,

            states: [
              {
                hover: {
                  backgroundColor: color(normalHex).lighten(0.1).hexString()
                }
              },
              {
                active: {
                  backgroundColor: color(normalHex).darken(0.2).hexString(),
                  backgroundImage: 'none',
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.04), inset 0 1px 0 0 rgba(0,0,0,.08)',
                }
              }
            ],
          };

          return m;
        }, {})
      },
      {
        block: {
          display: 'block',
          width: '100%'
        }
      },
      {
        disabled: {
          cursor: 'default',
          opacity: 0.7,
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.05)'
        }
      }
    ]
  };

  return {
    button
  };
}

export default {
  getStyles
};


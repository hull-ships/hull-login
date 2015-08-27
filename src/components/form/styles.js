'use strict';

import assign from 'object-assign';
import { getSettings } from '../../styles/settings';

function getStyles() {
  const settings = getSettings();

  const formButton = {
    marginTop: 10
  };

  const formControl = {
    width: '100%',
    paddingTop: 6,
    paddingRight: 10,
    paddingBottom: 6,
    paddingLeft: 10,
    fontSize: settings.defaultFontSize,
    lineHeight: settings.defaultLineHeight,
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    WebkitBoxSizing: 'border-box',
    MozBoxSizing: 'border-box',
    boxSizing: 'border-box',
    color: settings.blackColor,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: settings.grayLightColor,
    borderRadius: settings.defaultBorderRadius,
    boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.02)',
    borderTopColor: settings.grayColor,
    resize: 'none',

    states: [
      {
        focus: {
          borderColor: settings.grayDarkColor,
          backgroundColor: settings.grayLighterColor
        }
      }
    ],

    modifiers: [
      {
        hasError: {
          color: '#FF6262',
          borderColor: '#FF6262',
          borderTopColor: '#FF6262',
          boxShadow: 'none',

          states: [
            {
              focus: {
                borderColor: '#FF6262'
              }
            }
          ]
        }
      }
    ]
  };

  const formInput = formControl;

  const formTextarea = formControl;

  const formSelect = assign({}, formControl, {
    boxShadow: 'none',
    borderTopColor: settings.grayLightColor,
    backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMTJweCIgeT0iMHB4IiB3aWR0aD0iMjRweCIgaGVpZ2h0PSIzcHgiIHZpZXdCb3g9IjAgMCA2IDMiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDYgMyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBvbHlnb24gcG9pbnRzPSI1Ljk5MiwwIDIuOTkyLDMgLTAuMDA4LDAgIi8+PC9zdmc+")',
    backgroundPosition: '100% center',
    backgroundRepeat: 'no-repeat'
  });

  const errorMessage = {
    color: '#FF6262',
    fontSize: 12,
    marginTop: 5
  };


  return {
    formButton,
    formInput,
    formTextarea,
    formSelect,
    errorMessage
  };
}

export default {
  getStyles
};


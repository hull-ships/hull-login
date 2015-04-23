'use strict';

import color from 'color';
import { getSettings } from '../../styles/settings';

function getStyles() {
  const settings = getSettings();

  const overlayBackground = {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    zIndex: 20000,
    backgroundColor: 'rgba(0,0,0,.15)'
  };

  const overlay = {
    backgroundColor: settings.whiteColor,
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.15)',
    borderRadius: settings.mediumBorderRadius,
    width: 340,
    margin: '50px auto',
    padding: 30,
    position: 'relative'
  };

  const overlayCloseButton = {
    position: 'absolute',
    textAlign: 'center',
    width: 20,
    height: 20,
    fontSize: 20,
    lineHeight: '18px',
    textDecoration: 'none',
    top: 15,
    right: 15,
    color: settings.grayColor
  };

  return {
    overlayBackground,
    overlay,
    overlayCloseButton
  };
}

export default {
  getStyles
};


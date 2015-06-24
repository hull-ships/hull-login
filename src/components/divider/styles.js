'use strict';

import { getSettings } from '../../styles/settings';

function getStyles() {
  const settings = getSettings();

  const divider = {
    marginTop: 25,
    marginBottom: 25,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: settings.grayLightColor,
    textAlign: 'center',
    padding: 0,
    borderBottom: 'none',
    borderLeft: 'none',
    borderRight: 'none'
  };

  const dividerContent = {
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 10,
    lineHeight: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1
  };

  return {
    divider,
    dividerContent
  };
}

export default {
  getStyles
};


'use strict';

import { getSettings } from '../../styles/settings';

function getStyles() {
  const settings = getSettings();

  const sectionHeader = {
    marginBottom: 30
  };

  const sectionTitle = {
    color: settings.primaryColor,
    fontSize: 24,
    fontWeight: 300,
    textAlign: 'center'
  };

  const sectionText = {
    textAlign: 'center'
  };

  const sectionFooter = {
    marginTop: 30
  };

  return {
    sectionHeader,
    sectionTitle,
    sectionText,
    sectionFooter
  };
}

export default {
  getStyles
};


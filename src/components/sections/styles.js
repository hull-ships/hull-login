'use strict';

import { getSettings } from '../../styles/settings';

const sectionHeader = {
  marginBottom: 30
};

const sectionImage = {
  marginBottom: 10
};

const sectionText = {
  textAlign: 'center'
};

const sectionFooter = {
  marginTop: 30
};

function getStyles() {
  const settings = getSettings();

  const sectionTitle = {
    color: settings.primaryColor,
    fontSize: 24,
    fontWeight: 300,
    textAlign: 'center'
  };

  return {
    sectionHeader,
    sectionImage,
    sectionTitle,
    sectionText,
    sectionFooter
  };
}

export default {
  getStyles
};


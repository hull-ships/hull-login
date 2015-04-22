'use strict';

import { getSettings } from '../../styles/settings';

const settings = getSettings();

const section = {
};

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

export default {
  section,
  sectionHeader,
  sectionTitle,
  sectionText,
  sectionFooter
};


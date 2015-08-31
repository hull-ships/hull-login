import { getSettings } from '../styles/settings';

const sectionHeader = {
  marginBottom: 30
};

const sectionOrganizationImage = {
  marginBottom: 20
};

const sectionUserImage = {
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
    sectionOrganizationImage,
    sectionUserImage,
    sectionTitle,
    sectionText,
    sectionFooter
  };
}

export default {
  getStyles
};


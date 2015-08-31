import Engine from './engine';
import Mixins from './mixins';
import I18n from './i18n';
import Utils from './utils';
import FieldTypes from './field-types';
import { setSettings } from '../styles/settings';


function start(deployment) {
  let engine = new Engine(deployment);

  I18n.setTranslations(deployment.ship.translations);

  const shipSettings = deployment.ship.settings;
  setSettings({
    primaryColor: shipSettings.primary_color,
    textColor: shipSettings.text_color,
    linkColor: shipSettings.link_color,
    defaultBorderRadius: shipSettings.button_border_radius,
    mediumBorderRadius: shipSettings.overlay_border_radius
  });

  return engine;
}

export default {
  start,
  Engine,
  FieldTypes,
  I18n,
  Mixins,
  Utils
};

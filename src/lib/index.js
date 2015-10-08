import Engine from './engine';
import Mixins from './mixins';
import I18n from './i18n';
import Utils from './utils';
import FieldTypes from './field-types';
import { setSettings } from '../styles/settings';

function setupShip(ship) {
  I18n.setTranslations(ship.translations);

  const shipSettings = ship.settings;
  setSettings({
    primaryColor: shipSettings.primary_color,
    textColor: shipSettings.text_color,
    linkColor: shipSettings.link_color,
    defaultBorderRadius: shipSettings.button_border_radius,
    mediumBorderRadius: shipSettings.overlay_border_radius
  });
}

function start(deployment, hull) {
  let engine = new Engine(deployment, hull);
  setupShip(deployment.ship);
  if (deployment.onUpdate && typeof deployment.onUpdate === 'function') {
    deployment.onUpdate(function(ship) {
      setupShip(ship);
      engine.updateShip(ship);
    });
  }
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

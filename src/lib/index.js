import Engine from './engine';
import Mixins from './mixins';
import Utils from './utils';
import FieldTypes from './field-types';
import I18n from './i18n';

function start(deployment, hull) {
  const { onUpdate, settings } = deployment || {};
  const engine = new Engine(deployment, hull);

  function updateCustomizer(ship) {
    if (settings && settings._selector === '#___embedded_ship___') {
      if (ship) { engine.updateShip(ship); }
      engine.showDialog();
    }
  }

  if (onUpdate && typeof onUpdate === 'function') {
    deployment.onUpdate(updateCustomizer);
    updateCustomizer();
  }

  return engine;
}


export default {
  start,
  Engine,
  FieldTypes,
  Mixins,
  I18n,
  Utils,
};

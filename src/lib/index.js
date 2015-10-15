import Engine from './engine';
import Mixins from './mixins';
import Utils from './utils';
import FieldTypes from './field-types';
import I18n from './i18n';

function start(deployment, hull) {
  const engine = new Engine(deployment, hull);
  if (deployment.onUpdate && typeof deployment.onUpdate === 'function') {
    deployment.onUpdate(function(ship) {
      engine.updateShip(ship);
    });
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

import React from 'react';
import Engine from './engine';
import Ship from './ship.jsx';
import { setTranslations } from './i18n';

function bootstrap(element, deployment, organization) {
  var engine = new Engine(deployment, organization);

  setTranslations(deployment.ship.translations);

  var actions = engine.getActions();
  React.render(<Ship engine={engine} actions={actions} />, element);
}

export default bootstrap;


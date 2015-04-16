import React from 'react';
import Engine from './lib/engine';
import { setTranslations } from './lib/i18n';
import Ship from './components/ship';

export default function(element, deployment, organization) {
  var engine = new Engine(deployment, organization);

  setTranslations(deployment.ship.translations);
  // setStylesSettings TODO merge styles settings here

  var actions = engine.getActions();
  React.render(<Ship engine={engine} actions={actions} />, element);
}


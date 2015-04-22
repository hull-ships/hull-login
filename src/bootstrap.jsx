import React from 'react';
import Engine from './lib/engine';
import { setTranslations } from './lib/i18n';
import { setSettings, getSettings } from './styles/settings';
import Ship from './components/ship';

export default function(element, deployment, organization) {
  var engine = new Engine(deployment, organization);

  setTranslations(deployment.ship.translations);
  setSettings({
    primaryColor: 'red'
  });
  console.log(getSettings());

  var actions = engine.getActions();
  React.render(<Ship engine={engine} actions={actions} />, element);
}


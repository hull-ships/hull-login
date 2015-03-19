import React from 'react';
import Engine from '../lib/engine';
import { setTranslations } from '../lib/i18n';
import Ship from './ship';

function App(element, deployment, organization) {
  var engine = new Engine(deployment, organization);

  setTranslations(deployment.ship.translations);

  var actions = engine.getActions();
  React.render(<Ship engine={engine} actions={actions} />, element);
}

export default App;


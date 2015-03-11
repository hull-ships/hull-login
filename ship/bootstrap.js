import React from 'react';
import Engine from './engine';
import Ship from './ship.jsx';

function bootstrap(element, deployment) {
  var engine = new Engine(deployment);

  React.render(<Ship engine={engine} />, element);
}

export default bootstrap;


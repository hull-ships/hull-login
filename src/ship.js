import React from 'react';
import { start } from './lib';
import Main from './main';

Hull.onEmbed(document, function boostrap(element, deployment) {
  let engine = start(deployment);
  React.render(<Main engine={engine} actions={engine.getActions()} />, element);
});


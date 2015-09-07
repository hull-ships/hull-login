import React from 'react';
import { start } from './lib';
import Main from './main';

function onReady(hull, user, platform, organization) {
  let deployment = platform.deployments[0];
  deployment.organization = organization;

  let element = document.querySelector('#ship');

  let engine = start(deployment);
  React.render(<Main engine={engine} actions={engine.getActions()} />, element);
}

Hull.ready(onReady);

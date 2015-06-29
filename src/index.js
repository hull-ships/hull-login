'use strict';

import bootstrap from './bootstrap';

function onReady(hull, user, platform, organization) {
  let d = platform.deployments[0];
  d.organization = organization;

  bootstrap(document.querySelector('#ship'), d);
}

Hull.ready(onReady);


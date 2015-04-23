'use strict';

import bootstrap from './bootstrap';

Hull.ready(function(hull, user, platform, organization) {
  let d = platform.deployments[0];
  d.organization = organization;

  bootstrap(document.querySelector('#ship'), d);
});


'use strict';

import bootstrap from './bootstrap';

Hull.ready(function(hull, user, platform, organization) {
  let d = platform.deployments[0];

  bootstrap(document.querySelector('#ship'), d, organization);
});


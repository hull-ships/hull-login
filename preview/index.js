import manifest from '../manifest.json';
import translations from '../ship/locales/en.json';
import bootstrap from '../ship/bootstrap';

var c = {
  appId: manifest.demoKeys.appId,
  orgUrl: manifest.demoKeys.orgUrl,
  jsUrl: 'https://d3f5pyioow99x0.cloudfront.net/b2ec13003969151cc857ed82e66a8b13b2a1b9c7/hull.js'
};

Hull.init(c, function(hull, me, ship, organization) {
  if (ship.type !== 'ship') {
    var e = new Error('Object with id: ' + ship.id + ' is not a ship');

    throw e;
  }

  ship.manifest = manifest;
  ship.translations = { en: translations };

  var deployment = {
    ship: ship,

    platform: {},

    settings: {
      _selector: '#ship'
    }
  };

  // TODO use Hull.embed
  bootstrap(document.querySelector(deployment.settings._selector), deployment, organization);
});


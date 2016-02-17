import React from 'react';
import ReactDOM from 'react-dom';
import { start } from './lib';
import Main from './main';
import en from './locales/en.json';
import manifest from '../manifest.json';

const defaultSettings = manifest.settings.reduce((settings, s) => {
  if (s.default != null) {
    settings[s.name] = s.default;
  }
  return settings;
}, {});


const deployment = {
  platform: {
    type: 'platforms/shopify_shop'
  },
  ship: {
    settings: {
      ...defaultSettings,
      logo_image: document.location.origin + '/picture.png',
      show_inline: true
    },
    translations: { en },
    resources: {}
  },
  organization: {
    name: 'Hull Login Test !'
  }
};

function onReady(hull) {
  const element = document.querySelector('#ship');
  const engine = start(deployment, hull);
  const app = <Main engine={engine} actions={engine.getActions()} />;
  ReactDOM.render(app, element);
}

Hull.ready(onReady);

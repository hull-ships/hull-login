import React from 'react';
import Engine from './lib/engine';
import { setTranslations } from './lib/i18n';
import { setSettings, getSettings } from './styles/settings';


import Ship from './components/ship';

function hasTouchEvent() {
  return (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
}

export default function(element, deployment) {
  let engine = new Engine(deployment);

  setTranslations(deployment.ship.translations);

  const shipSettings = deployment.ship.settings;
  setSettings({
    primaryColor: shipSettings.primary_color,
    textColor: shipSettings.text_color,
    linkColor: shipSettings.link_color,
    defaultBorderRadius: shipSettings.button_border_radius,
    mediumBorderRadius: shipSettings.overlay_border_radius
  });

  if (hasTouchEvent()) { React.initializeTouchEvents(true); }

  React.render(<Ship engine={engine} actions={engine.getActions()} />, element);
};


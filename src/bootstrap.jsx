import React from 'react';
import Engine from './lib/engine';
import { setTranslations } from './lib/i18n';
import { setSettings, getSettings } from './styles/settings';
import Ship from './components/ship';

export default function(element, deployment) {
  let engine = new Engine(deployment);

  setTranslations(deployment.ship.translations);

  const shipSettings = deployment.ship.settings;
  setSettings({
    primaryColor: shipSettings.appearance.primary_color,
    textColor: shipSettings.appearance.text_color,
    linkColor: shipSettings.appearance.link_color,
    defaultBorderRadius: shipSettings.appearance.button_border_radius,
    mediumBorderRadius: shipSettings.appearance.overlay_border_radius
  });

  React.render(<Ship engine={engine} actions={engine.getActions()} />, element);
};


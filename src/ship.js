import React from 'react';
import Engine from './lib/engine';
import { setTranslations } from './lib/i18n';
import { setSettings } from './styles/settings';
import Main from './main';

Hull.onEmbed(document, function boostrap(element, deployment) {
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

  React.render(<Main engine={engine} actions={engine.getActions()} />, element);
});


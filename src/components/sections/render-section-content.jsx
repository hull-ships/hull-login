'use strict';

import React from 'react';
import SocialButtons from '../social-buttons';
import Divider from '../divider';
import Form from '../form';

function renderSectionContent(props, formProps) {
  let buttons;
  if (props.providers.length > 0) {
    buttons = <SocialButtons key='buttons' {...props} />;
  }

  let form;
  if (props.shipSettings.show_classic_login) {
    form = <Form key='form' {...formProps} />
  }

  if (buttons && form) {
    return [
      buttons,
      <Divider key='divider'>or</Divider>,
      form
    ];
  } else if (buttons || form) {
    return buttons || form;
  } else {
    throw new Error('There is no provider and classic login is disabled.');
  }
}

export default renderSectionContent;

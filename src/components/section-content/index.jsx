import React from 'react';
import Divider from '../divider';
import Form from '../form';
import SocialButtons from '../social-buttons';

const SectionContent = React.createClass({
  displayName: 'SectionContent',

  render() {
    let buttons;
    let { shipSettings, providers, formProps } = this.props;

    if (providers.length > 0) {
      buttons = <SocialButtons key='buttons' {...this.props} />;
    }

    let form;
    if (shipSettings.show_classic_login) {
      form = <Form key='form' {...formProps} autoDisableSubmit={shipSettings.disable_buttons_automatically} />;
    }

    if (buttons == null && form == null) {
      throw new Error('There is no provider and classic login is disabled.');
    }


    return <div>
      {buttons}
      <Divider key='divider'>or</Divider>
      {form}
    </div>;
  }
});

export default SectionContent;

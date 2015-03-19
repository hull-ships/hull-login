import React from 'react';
import { translate } from '../lib/i18n';

export default React.createClass({
  handleLogOut: function(e) {
    e.preventDefault();

    this.props.logOut();
    this.props.hideDialog();
  },

  render: function() {
    return (
      <div>
        <h1>Hi {this.props.user.name}</h1>
        <p><a href="#" className='small button round right' onClick={this.handleLogOut}>{translate('log_out')}</a></p>
      </div>
    );
  }
});


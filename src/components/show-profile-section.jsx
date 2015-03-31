import React from 'react';
import { translate } from '../lib/i18n';

export default React.createClass({
  handleLogOut: function(e) {
    e.preventDefault();

    this.props.logOut();
    this.props.hideDialog();
  },

  render: function() {
    if(this.props.user.picture){
      var img = <img src={this.props.user.picture} className='avatar circle'/>
    }
    return (
      <div className='text-center'>
        {img}
        <h4>Hi {this.props.user.name}</h4>
        <p><a href="#" className='small button radius expand m0' onClick={this.handleLogOut}>{translate('Log out')}</a></p>
      </div>
    );
  }
});


import React from 'react';

export default class BaseSection extends React.Component {

  renderHeader() {
  }

  renderFooter() {
  }

  renderContent() {
  }

  render() {
    return (
      <div>
        {this.renderHeader()}
        {this.renderContent()}
        {this.renderFooter()}
      </div>
    );
  }
}

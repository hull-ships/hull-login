import React from 'react';

const styles = {
  imageContainer: {
    textAlign: 'center'
  },

  image: {
    maxWidth: 280,
    maxHeight: 140
  }
};

export default React.createClass({
  displayName: 'OrganizationImage',

  render() {
    const url = this.props.src;

    if (!url) { return <noscript />; }

    return (
      <div style={this.props.style}>
        <div style={styles.imageContainer}>
          <img style={styles.image} src={url} />
        </div>
      </div>
    );
  }
});


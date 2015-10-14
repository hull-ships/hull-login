import _ from 'lodash';
import React from 'react';
import radium from 'radium';
import color from 'color';
import styleMixins from '../../styles/mixins.css';
import { Style } from 'radium';

const Styles = React.createClass({
  propTypes: {
    scope: React.PropTypes.string.isRequired,
    settings: React.PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      styles: {},
    };
  },

  getSelector() {
    return `.${this.props.scope}`;
  },

  getStyles() {
    const {
      primary_color: primary,
      link_color: link,
      background_color: background,
      text_color: text,
      button_border_radius: buttonBorderRadius,
      overlay_border_radius: overlayBorderRadius,
    } = this.props.settings;
    const buttonTextColor = color(primary).darken(0.5).dark() ? 'white' : '#444';
    const controlTextColor = color(text).dark() ? text : '#444';
    return {
      primaryText: {
        normal: {
          color: primary,
        },
      },
      darkerText: {
        normal: {
          color: color(text).darken(0.3).hexString(),
        },
      },
      borderColor: {
        normal: {
          borderColor: color(text).alpha(0.5).hslString(),
        },
      },
      linkText: {
        'normal': {
          color: link,
        },
        ':link': {
          color: link,
        },
        ':active': {
          color: link,
        },
        ':visited': {
          color: link,
        },
        ':hover': {
          color: color(link).darken(0.2).hexString(),
        },
        ':focus': {
          color: color(link).darken(0.2).hexString(),
        },
      },
      borderRadius: {
        normal: {
          borderRadius: overlayBorderRadius,
        },
      },
      smallBorderRadius: {
        normal: {
          borderRadius: (overlayBorderRadius / 2),
        },
      },
      modal: {
        normal: {
          color: this.props.settings.text_color,
          backgroundColor: background,
        },
      },
      control: {
        'normal': {
          color: controlTextColor,
        },
        ':focus': {
          boxShadow: `inset 0 0 0 1px ${primary}`,

        },
      },
      button: {
        'normal': {
          color: buttonTextColor,
          borderRadius: buttonBorderRadius,
          backgroundColor: primary,
        },
        ':link': {
          color: buttonTextColor,
          backgroundColor: primary,
        },
        ':visited': {
          color: buttonTextColor,
          backgroundColor: primary,
        },
        ':active': {
          color: buttonTextColor,
          backgroundColor: color(primary).darken(0.2).hexString(),
        },
        ':hover': {
          color: buttonTextColor,
          backgroundColor: color(primary).darken(0.2).hexString(),
        },
        ':focus': {
          color: buttonTextColor,
          backgroundColor: color(primary).darken(0.2).hexString(),
        },
      },

      placeholder: {
        color: color(text).alpha(0.2).hexString(),
      },
    };
  },

  getRules() {
    const styles = this.getStyles();

    return _.reduce(styleMixins, function(hash, cls, name) {
      const style = styles[name];
      if (!style) { return hash; }
      _.each(cls.split(' '), function(n) {
        if (!hash[`.${n}`]) {
          _.each(style, function(rule, key) {
            if (key === 'normal') {
              hash[`.${n}`] = rule;
            } else {
              hash[`.${n}${key}`] = rule;
            }
          });
        }
      });
      return hash;
    }, {
      [`.${this.props.scope} ::-moz-placeholder`]: styles.placeholder,
      [`.${this.props.scope} input::-moz-placeholder`]: styles.placeholder,
      [`.${this.props.scope} textarea::-moz-placeholder`]: styles.placeholder,
      [`.${this.props.scope} :-ms-input-placeholder`]: styles.placeholder,
      [`.${this.props.scope} input:-ms-input-placeholder`]: styles.placeholder,
      [`.${this.props.scope} textarea:-ms-input-placeholder`]: styles.placeholder,
      [`.${this.props.scope} ::-webkit-input-placeholder`]: styles.placeholder,
      [`.${this.props.scope} input::-webkit-input-placeholder`]: styles.placeholder,
      [`.${this.props.scope} textarea::-webkit-input-placeholder`]: styles.placeholder,
      [`.${this.props.scope} ::-moz-focus-inner`]: { border: 0, padding: 0 },
    });
  },

  render() {
    return <Style rules={this.getRules()} />;
  },
});

export default radium(Styles);

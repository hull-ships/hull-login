'use strict';
/* global module,import */

import React from 'react';
import classnames from 'classnames';
import SVGIcon from 'svg-inline-loader/lib/component.jsx';
import styles from './icon.css';
import cssModules from 'react-css-modules';
import _ from 'lodash';
import icons from '../../icons';

@cssModules(styles, {allowMultiple: true})
export default class Icon extends React.Component {

  static propTypes = {
    name: React.PropTypes.string.isRequired,
    colorize: React.PropTypes.bool,
    color: React.PropTypes.string,
  }

  static defaultProps = {colorize: false, style: {}, size: 16 };

  render() {
    const { name, colorize, color } = this.props;
    const props = _.omit(this.props, 'styles');
    const src = icons[name];
    if (!src) {
      return <i/>;
    }
    let outputStyle = {};
    if (color) {
      outputStyle = {...outputStyle, color};
    }
    return <SVGIcon src={src} styleName={classnames({icon: true, colorized: !!colorize})} {...props} style={outputStyle} />;
  }
}

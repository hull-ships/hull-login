import React from 'react';
import cssModules from 'react-css-modules';
import styles from './error.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const ErrrorMessage = React.createClass({
  propTypes: {
    styles: React.PropTypes.object,
    children: React.PropTypes.any
  },

  render() {
    if (!this.props.children) { return null;}
    const { enter, enterActive, leave, leaveActive, appear, appearActive } = this.props.styles;
    return (
      <div styleName="popover">
        <ReactCSSTransitionGroup
            component="div"
            transitionEnterTimeout={250}
            transitionLeaveTimeout={250}
            transitionName={{ enter, enterActive, leave, leaveActive, appear, appearActive }}
            ><span styleName="error">{this.props.children}</span></ReactCSSTransitionGroup>
      </div>
    );
  }
});

export default cssModules(ErrrorMessage, styles);

import React from 'react';
import * as Icons from './icons';
import _ from 'underscore';
import capitalize from '../../lib/capitalize';

var icons = _.reduce(Icons, function(memo, value, key){
  memo[key] = React.createClass({
    getDefaultProps() {
      return {
        size:16,
        settings:{}
      };
    },
    render(){
      var size=this.props.size;
      var color = this.props.color||this.props.settings.light_color;
      return (
        <svg width={`${size}px`} height={`${size}px`} className={`svg-icon svg-icon-${key}`} {...value.svg} >
          <path fill={color} {...value.path}/>
        </svg>
      );
    }

  });
  return memo;
},{});
var Icon = React.createClass({
  render: function() {
    var name = this.props.name
    var I = icons[capitalize(name)] || 'i'
    return <I {...this.props}/>;
  }
});

module.exports = Icon;

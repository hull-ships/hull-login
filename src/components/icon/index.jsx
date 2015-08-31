import React from 'react';
import assign from 'object-assign';
import _ from 'underscore';
import Icons from 'json-svg-icons';

function parseLevel(level, opts) {
  let [tag, attributes, ...children] = level;
  if (_.isArray(children) && children.length) {
    children = children.map(function(child) {
      return parseLevel(child, opts);
    });
  }

  let attrs = {};
  if (attributes) {
    attrs = _.reduce(opts, function(memo, value, key) {
      if (attributes[key] && attributes[key] !== 'none') {
        memo[key] = value;
      }
      return memo;
    }, {});
  }
  attributes = assign({}, attributes, attrs);
  return React.createElement(tag, attributes, ...children);
}

let icons = _.reduce(Icons, function(memo, icon, name) {
  memo[name] = React.createClass({
    getDefaultProps() {
      return {
        size: 24,
        settings: {}
      };
    },

    render() {
      let size = this.props.size;
      let color = this.props.color || this.props.settings.light_color || 'currentColor';
      // Apply some values to the root tag
      icon[1] = assign(icon[1], {
        width: `${size}`,
        height: `${size}`,
        className: `svg-icon svg-icon-${name}`,
        style: this.props.style
      });

      return parseLevel(icon, { fill: color, stroke: color });
    }
  });

  return memo;
}, {});


let Icon = React.createClass({
  render: function() {
    let name = this.props.name;
    let I = icons[name] || 'i';

    return <I {...this.props} />;
  }
});

export default Icon;

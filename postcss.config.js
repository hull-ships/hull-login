module.exports = [
  require("precss")({
    /* options */
  }), // Sass-like syntax
  require("postcss-round-subpixels"),
  /* IE */
  require("postcss-pseudoelements"),
  require("postcss-color-rgba-fallback"),
  require("postcss-opacity"),
  require("postcss-vmin"),
  /* END IE */
  require("postcss-initial"), // all:initial
  require("cssnext"),
  require("cssnano")({ safe: true }), // Condense & Optimize
];

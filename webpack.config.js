var _           = require('lodash');
var webpack     = require('webpack');
var StatsPlugin = require('stats-webpack-plugin');


module.exports = function(config){

  return {
    development:{
      name     : 'browser',
      // devtool  : '#source-map',
      devServer: true,
      module   : {loaders: config.devLoaders},
      resolve  : config.resolve,
      postcss  : config.postcss,
      node: {
        fs: "empty" //Prevents MessageFormat from erroring
      },
      entry    : config.devEntry,
      output   : config.output,
      plugins  : config.devPlugins.concat([
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({'process.env': {'NODE_ENV': JSON.stringify('development') } }),
      ])
    },
    production:{
      name     : 'browser',
      devtool  : '#source-map',
      module   : {loaders: config.loaders},
      resolve  : config.resolve,
      postcss  : config.postcss,
      node: {
        fs: "empty" //Prevents MessageFormat from erroring
      },
      entry    : config.entry,
      output   : config.output,
      plugins  : config.plugins.concat([
        new webpack.DefinePlugin({'process.env': {'NODE_ENV': JSON.stringify('production') } }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          output: {comments: false},
          compress: { drop_console: true },
          minimize:true,
          ascii_only:true,
          quote_keys:true,
          sourceMap: true,
          beautify: false
        }),
        new StatsPlugin('stats.json', { chunkModules: true, profile: true })
      ])
    }
  }
}

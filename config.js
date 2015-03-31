"use strict";

/*global module, require, process, __dirname */
var webpack = require("webpack");
var path = require("path");
var pkg = require("./package.json");
var manifest = require("./manifest.json");

var moment = require("moment");

// DO NOT CHANGE FOLDERS
// WIHTOUT UPDATING PACKAGE.JSON TOO.
var sourceFolder = "src";
var outputFolder = "dist";
var assetsFolder = "";
var serverPort   = process.env.PORT||8081;
var previewUrl   = "http://localhost:"+serverPort;

var hotReload = true;

// DO NOT CHANGE SHIP ENTRY
// WITHOUT UPDATING PACKAGE.JSON TOO
// THESE ARE THE JS FILES USED AS ENTRY POINTS TO COMPILE YOUR APP

var entry = {
  ship:  "./"+sourceFolder+"/ship.js",
  index: "./"+sourceFolder+"/index.js"
};

// ADDITIONAL FILES TO BE COPIED BY GULP
function gulpDest(out){
  return path.join(outputFolder,assetsFolder,out);
}

var files = {
  "src/locales/**/*" : gulpDest("locales/"),
  "src/vendors/**/*" : gulpDest("vendors/"),
  "src/images/**/*"  : gulpDest("images/"),
  "manifest.json"    : outputFolder,
  "src/*.png"        : outputFolder,
  "src/*.html"       : outputFolder,
  "CNAME"            : outputFolder,
};

var libName = pkg.name;
var displayName = manifest.name||libName;


// ------------------------------------------------
// ------------------------------------------------
// NO NEED TO TOUCH ANYTHING BELOW THIS
// ------------------------------------------------
// ------------------------------------------------

var outputPath = path.join(__dirname, outputFolder);

var output = {
  path: path.join(outputPath,assetsFolder,"/"),
  pathinfo: true,
  filename: "[name].js",
  chunkFileName: "[name].chunk.js",
  libraryTarget: "umd",
  library: displayName,
  publicPath: assetsFolder+"/"
};

var extensions         = ["", ".js", ".jsx", ".css", ".scss"];

var modulesDirectories = ["node_modules", "bower_components", "bower_components/foundation/scss/", "src/vendor"];

var cssIncludes   = modulesDirectories.map(function(include){
  return ("includePaths[]="+path.resolve(__dirname, include));
}).join("&");


// https://github.com/webpack/react-starter/blob/master/make-webpack-config.js
// "imports?define=>false": Yeah, we"re going big and disabling AMD completely. F**k it.
// This is because webpack strips the `this` context when requiring those, while they expect it.
// Basically, this fixes all of our problems with badly constructed AMD modules.
// Among which: vex, datepicker, underscore-contrib
var loaders = [
  {test: /\.json$/,                loaders: ["json-loader"] },
  {test: /\.js$/,                  loaders: ["babel-loader"], exclude: /node_modules|bower_components/},
  {test: /\.jsx$/,                 loaders: ["react-hot", "babel-loader"], exclude: /node_modules/},
  {test: /\.(css|scss)$/,          loaders: ["style/useable", "css-loader", "autoprefixer-loader?browsers=last 2 version", "sass-loader?outputStyle=expanded&"+cssIncludes]},
  {test: /\.jpe?g$|\.gif$|\.png$/, loaders: ["file"]},
  {test: /\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/, loader: "file" },
];

// We remove the "dist" from the filenames for demo and index.html in package.json
// Package.json expects our files to be addressable from the same repo
// We put them in `dist` to have a clean structure but then we need to build them in the right place
var plugins = [
  new webpack.DefinePlugin({
    "BUILD_DATE" : JSON.stringify(moment().format("MMMM, DD, YYYY, HH:mm:ss")),
    "PUBLIC_PATH": JSON.stringify(output.publicPath)
  }),
  new webpack.ResolverPlugin(
    new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
  ),
  new webpack.optimize.OccurenceOrderPlugin()
];

var externals = {};

module.exports = {
  hotReload          : hotReload,
  libName            : libName,
  displayName        : displayName,

  files              : files,

  outputFolder       : outputFolder,
  assetsFolder       : assetsFolder,
  serverPort         : serverPort,
  previewUrl         : previewUrl,

  entry              : entry,
  output             : output,
  extensions         : extensions,
  modulesDirectories : modulesDirectories,
  plugins            : plugins,
  loaders            : loaders,
  externals          : externals,

  pkg                : pkg
};

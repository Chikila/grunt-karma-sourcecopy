'use strict';
var path = require('path');

//
// Returns a string representing the sources of js and css files from the given file
// It uses the option parameters sourcePrefix and sourcePostfix to create the structure
// Each item of the string has the following form:
//
// sourcePrefix <'SOURCE'> sourcePostfix
// Default: { src: <SOURCE> }
//
// The default is created to fit into a grunt-file for Karma/Jasmine test projects.
//
// Note that when treating an HTML file making usage of requireJS
// an additional information for the block is added, regarding RequireJS
// configuration. For example:
//
//       requirejs: {
//         name: 'scripts/main',
//         dest: 'scripts/foo.js'
//       }
// requireJS is currently NOT supported
//
var getSources = function (dest, dir, content, sourcePrefix, sourcePostfix) {
  var lines = content.replace(/\r\n/g, '\n').split(/\n/),
    backslash = /\\/g,
    last = {
        type: '',
        dest: dest,
        startFromRoot: false,
        indent: '',
        src: [],
        raw: []
      };

  var originDir = dir;

  lines.forEach(function (l) {
    if (last) {
      var asset = l.match(/(link href|src)=["']([^'"]+)["']/);
      if (asset && asset[2]) {
        var newlineNeeded = !last.src.length ? '' : '\n';
        var lineToPush = newlineNeeded + sourcePrefix + ' \'' + path.join(originDir, asset[2]).replace(backslash, '/') + '\' ' + sourcePostfix;
        last.src.push(lineToPush);
        // preserve media attribute
        var media = l.match(/media=['"]([^'"]+)['"]/);
        if (media) {
          last.media = media[1];
        }
      }
      last.raw.push(l);
    }
  });
  //Push empty string in order to add a comma at the end of the returnstring
  last.src.push('');
  return last;
};

//
// HTMLProcessor takes care, and processes HTML files.
// It is given:
//   - A base directory, which is the directory under which to look at references files
//   - A destination directory, which is the directory under which will be generated the files
//   - A file content to be processed
//   - an optional log callback that will be called as soon as there's something to log
//
var HTMLProcessor = module.exports = function (src, dest, content, logcb) {
  this.src = src;
  this.dest = dest || src;
  this.content = content;
  this.relativeSrc = path.relative(process.cwd(), src);
  this.linefeed = /\r\n/g.test(this.content) ? '\r\n' : '\n';
  this.logcb = logcb || function () {};
};

//
// Calls the log callback function
//
HTMLProcessor.prototype.log = function log(msg) {
  this.logcb(msg);
};

HTMLProcessor.prototype.getSources = function getSrcblocks(sourcePrefix, sourcePostfix) {
  return getSources(this.dest, this.relativeSrc, this.content, sourcePrefix, sourcePostfix);
}
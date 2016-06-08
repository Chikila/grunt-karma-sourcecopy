'use strict';
var debug = require('debug')('fileprocessor');

var FileProcessor = module.exports = function (logcb) {
  this.log = logcb || function () {};
};

var getRawBlocks = function (content) {
  //  * <!-- srccpy:begin (optional: environment) -->
  //  * <!-- srccpy:end -->
  var regbuild = /<!--\s*srccpy:begin\s*([^\s]+)?\s*-->/;
  var regend = /<!--\s*srccpy:end\s*-->/;
  // start build pattern: will match
  var lines = content.replace(/\r\n/g, '\n').split(/\n/);
  var block = false;
  var sections = [];
  var blockToReplace;

  lines.forEach(function (l) {
    var indent = (l.match(/^\s*/) || [])[0];
    var build = l.match(regbuild);
    var endbuild = regend.test(l);
    if (build) {
      block = true;
      blockToReplace = {
        raw: [],
        indent: indent,
        beginbuild: l,
        endbuild: null,
        environment: build[1]
      }
    }

    // switch back block flag when endbuild
    if (block && endbuild) {
      blockToReplace.endbuild = l;
      blockToReplace.raw.push(l);
      sections.push(blockToReplace);
      block = false;
    }

    if (block && blockToReplace) {
      blockToReplace.raw.push(l);
    }
  });
  return sections;
};

//
// Replace blocks by their target
//
FileProcessor.prototype.replaceBlocks = function replaceBlocks(content, replacementBlock, environment) {
  var blocks = getRawBlocks(content);
  var result = content;
  var linefeed = /\r\n/g.test(result) ? '\r\n' : '\n';
  blocks.forEach(function (block) {
    if(!environment || environment === block.environment) {
      var blockLine = block.raw.join(linefeed);
      var replaceBlock = block.indent + replacementBlock.replace(/(?:\r\n|\r|\n)/g, '\n' + block.indent);
      // Reinsert the srccpy tags for future rebuilds
      replaceBlock = block.beginbuild + '\n' + replaceBlock + '\n' + block.endbuild
      result = result.replace(blockLine, replaceBlock);
    }
  }, this);
  return result;
};
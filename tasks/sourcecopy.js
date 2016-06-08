'use strict';
var path = require('path');

module.exports = function(grunt) {
    var HTMLProcessor = require('../lib/htmlprocessor.js');
    var FileProcessor = require('../lib/fileprocessor.js');

    grunt.registerMultiTask('grunt-karma-sourcecopy', 'Using HTML markup as the primary source of information', function() {
        var options = this.options();
        var dest = options.dest || options.targetfile;
        var targetFile = options.targetfile;
        var fileList = {};
        var splitBy = process.platform === 'win32' ? '\\' : '/';
        var environment = options.environment;
        var sourcePrefix = options.sourcePrefix;
        var sourcePostfix = options.sourcePostfix;
        var finalString = '';
        // collect files
        if(options.src === undefined) {
            throw new Error('Options needs a src parameter. This is the html source file to copy sources from.');
        }
        if(targetFile === undefined) {
            throw new Error('Options needs a target parameter. This is the file to copy the sources to.');
        }
        if(options.environment === undefined && options.log) {
            console.log('Environment not set - Copying to all tags');
        }
        if(sourcePrefix === undefined) {
            sourcePrefix = '{ src:';
        }
        if(sourcePostfix === undefined) {
            sourcePostfix = '}';
        }
        var files = getFilesList(options.src);

        files.forEach(function(file) {
            var proc = new HTMLProcessor(path.dirname(file.path), dest, file.body, function(msg) {
                grunt.log.writeln(msg);
            });
            var key = proc.dest;
            key = key[key.length-1].split('.')[0];
            var srcblock = proc.getSources(sourcePrefix, sourcePostfix);
            fileList[key]=srcblock.src;
            finalString = finalString.concat(srcblock.src);
        });
        var target = getFilesList(targetFile);

        var targetproc = new FileProcessor(function(msg) {
                grunt.log.writeln(msg);
            });
        var finalFile = targetproc.replaceBlocks(target[0].body, finalString, environment);
        grunt.file.write(dest, finalFile);
        if(options.log){
            console.log(fileList);
            console.log('File list object saved at '+dest);
        }
    });

    function getFilesList(files) {
        var fileList = grunt.file.expand({
            filter: 'isFile'
        }, files);
        return fileList.map(function(filepath) {
            return {
                path: filepath,
                body: grunt.file.read(filepath)
            };
        });
    }
};

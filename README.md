# grunt-karma-sourcecopy

> This is based on grunt usemin and grunt useminlist. 

This plugins purpose is to js and css sources from a html file into a gruntfile to keep the exact loading order of files intact within testing environments. It is created to be used with karma.

The plugin turns these sources into a specific format that is used by karma in the gruntfile/karma.conf. This format looks like the following: `{ src: 'path/to/some/source.js' },`.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install TODO
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-karma-sourcescopy');
```

## The "grunt-karma-sourcescopy" task

### Overview
In your project's Gruntfile, add a section named `grunt-karma-sourcescopy` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  'grunt-karma-sourcescopy': {
    options: {
      src: 'path/to/html/index.html',
      dest: 'path/to/output/gruntfile.js', // The gruntfile that will be created/overwritten. Defaults to targetFile.
      log: false, //log to console
      targetFile: 'path/to/gruntfile.js',
      environment: 'dev' // Looks for this enviroment in the gruntfile. Explained below.
    }
  },
})
```

### Options

#### options.src
Type: `String`
`REQUIRED`

The HTML file that needs to be parsed. This is the file where the plugin searches for sources for JS and CSS files to insert into the targetFile.

#### options.targetFile
Type: `String`
`REQUIRED`

The gruntfile where the plugin will look for the required tags to insert the sources into.

#### options.dest
Type: `String`
`OPTIONAL`

This is the file that will be created or overwritten by the program. Can be used if you have a template gruntfile. If left blank, it defaults to your targetFile and simply overwrites that.

#### options.log
Type: `Boolean`
`OPTIONAL`

Logs certain output to the console.

#### options.environment
Type: `String`
`OPTIONAL`

Declares if you would like to see the json object logged in the console.

### Required tag in targetFile
The plugin will search for a certain tag in order to determine where it needs to insert the sources.
The tags:
```js
<!-- srccpy:begin -->
<!-- srccpy:end -->
```

Everything within these tags will be removed and replaced with the sources that the plugin finds in the src file. The above example contains no environment variable and will thus be used when no environment variable is set in options.

If you instead want to use the tags with only a specific environment, like development only/production only, you can set the environment tag as follows: 
```js
<!-- srccpy:begin dev -->
<!-- srccpy:end -->
```

This tells the plugin that if the environment variable in options is set to 'dev', this is where it needs to insert the sources.

### Usage Examples 
The plugin is mainly created to modify your gruntfile.js to get all the sources from a html file. The set of tags needs to be inserted into the targetFile, placed where the sources need to be inserted.

Below is an example where two different environments have been set, to describe both the development build and the production build.

```js
karma: {
    options: {
        configFile: 'karma.conf.js'
    },
    run: {
        singleRun: true,
        files: [
            <!-- srccpy:begin run -->
            <!-- srccpy:end -->
            some/tests.js
            ]
    },
    dev: {
        singleRun: false,
        files: [
            <!-- srccpy:begin dev -->
            <!-- srccpy:end -->
            some/tests.js
            ]
    }
}
```

## Future Todos
There are a few pieces currently missing that I would like to have implemented into the project. Currently the list is:
- Implement possibility to choose your own Source structures. Currently only { src: <SOURCE> } is supported, but I would like to support custom structures in a non-confusing way.
- Implement RequireJs support

## Contributing


## Release History
0.1 Project started

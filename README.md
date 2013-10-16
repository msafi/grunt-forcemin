# forcemin

Say you have a bunch of revisioned files, each one looks something like `ae35dd05.app.js`, but in your source code, you are actually referencing those files by their original names, `app.js`. 

How do you update your source code references automatically as part of your build process? This Grunt plugin can help!

`forcemin` goes inside the source code of your files, finds where your code references other files, and it changes those references to the new revisioned names.

`forcemin` expects your revisioned files to have the following naming convention:

`[version number] [dot] [file name] [whatever...] [dot] [extension]`

`forcemin` works best with [`grunt-rev`](https://github.com/cbas/grunt-rev/)

## How it works

First, `forcemin` will make a list of the names of all of your revisioned files in the directories that you specify. Then it'll go inside each of those files looking for references to the original file name, that is without the version string. When a reference is found, it is replaced with the revisioned file name.

## Workflow example

A build process utilizing this plugin could go like this

1. [Clean](https://github.com/gruntjs/grunt-contrib-clean) the build directory by removing everything in it
2. [Copy](https://github.com/gruntjs/grunt-contrib-copy) files from the source directory to the build directory
3. [Uglify](https://github.com/gruntjs/grunt-contrib-uglify) JavaScript files
4. [Minify HTML](https://github.com/gruntjs/grunt-contrib-htmlmin) files
5. [Minify CSS](https://github.com/gruntjs/grunt-contrib-cssmin) files
6. [Revision](https://github.com/cbas/grunt-rev/) all files
7. Change the references inside the files to the new revisioned names using `forcemin`

## Getting Started

This plugin requires Grunt `0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install forcemin --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-forcemin');
```

### Overview
In your project's Gruntfile, add a section named `forcemin` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  forcemin: {
    src: [
      'build/client/**/*.{js,css,html,ejs}',
      '!build/client/**/vendor/**'
    ]
  }
})
```

## License
Unlicensed. Public domain.

Backup everything before using this plugin. I guarantee nothing. If my code completely obliterates your project, I'm not responsible.
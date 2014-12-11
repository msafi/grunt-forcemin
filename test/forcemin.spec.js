'use strict';
var grunt = require('grunt')
var expect = require('expect.js')

function bootstrap(srcArr, readOnly) {
  var config = {
    dist: {
      files: {
        src: srcArr
      }
    }
  };

  if(readOnly) {
    config.dist.options = {
      readOnly: readOnly
    };
  };

  grunt.config('forcemin', config);

  grunt.task.run('forcemin')
  grunt.task.start()

  return require('./temp/69fjamc.script.js')
}

describe('forcemin', function() {
  var fileOperatedOn

  beforeEach(function() {
    grunt.task.init([])
    grunt.config.init({})

    // Copy files to a 'temp' folder to operate on them
    grunt.file.recurse('test/fixtures', function(abspath, _1, _2, filename) {
      grunt.file.copy(abspath, 'test/temp/' + filename)
    })

    // Make sure each require reloads fresh data. No cache.
    delete require.cache[require.resolve('./temp/69fjamc.script.js')]
    delete require.cache[require.resolve('./temp/67as82.readOnly.js')]
  })

  afterEach(function() {
    // Tests are done. Clean up.
    grunt.file.delete('test/temp/')
  })

  it('should scan all user-specified files and replace references', function(done) {
    fileOperatedOn = bootstrap(['test/temp/**/*'])

    expect(fileOperatedOn.style).to.be('f4.style.css')
    expect(fileOperatedOn.template).to.be('f84hfsd.template.html')
    expect(fileOperatedOn.script).to.be('69fjamc.script.js')
    expect(fileOperatedOn.revisionedScriptMap).to.be('mc4593fc.second.script.js.map')
    expect(fileOperatedOn.robots).to.be('robots.txt')
    done()
  })

  it('should not add files with fewer than two dots to dictionary, but should still update their contents', function(done) {
    fileOperatedOn = bootstrap(['test/temp/robots.txt', 'test/temp/mc4593fc.second.script.js.map'])

    expect(fileOperatedOn.robots).to.be('robots.txt')
    expect(grunt.file.read("test/temp/robots.txt")).to.be('mc4593fc.second.script.js.map')
    done()
  })

  it('should distinguish between script.js and script.js.map', function(done) {
    fileOperatedOn = bootstrap(['test/temp/*script.js'])

    expect(fileOperatedOn.scriptMap).to.be('script.js.map')
    expect(fileOperatedOn.script).to.be('69fjamc.script.js')
    done()
  })

  it('should not modify read only files', function(done) {
    fileOperatedOn = bootstrap(['test/temp/**/*'], ['**/*.readOnly.js'])

    expect(fileOperatedOn.style).to.be('f4.style.css')
    expect(fileOperatedOn.template).to.be('f84hfsd.template.html')
    expect(fileOperatedOn.script).to.be('69fjamc.script.js')
    expect(fileOperatedOn.revisionedScriptMap).to.be('mc4593fc.second.script.js.map')
    expect(fileOperatedOn.robots).to.be('robots.txt')
    expect(fileOperatedOn.readOnly).to.be('67as82.readOnly.js')

    var readOnlyFile = require('./temp/67as82.readOnly.js')

    expect(readOnlyFile.style).to.be('style.css')
    expect(readOnlyFile.template).to.be('template.html')
    expect(readOnlyFile.script).to.be('script.js')
    expect(readOnlyFile.revisionedScriptMap).to.be('second.script.js.map')
    expect(readOnlyFile.robots).to.be('robots.txt')
    expect(readOnlyFile.readOnly).to.be('readOnly.js')

    done()
  })
})

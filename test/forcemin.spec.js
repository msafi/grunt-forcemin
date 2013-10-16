'use strict';
var grunt = require('grunt')
var expect = require('expect.js')

function bootstrap(srcArr) {
  grunt.config('forcemin', {
    src: srcArr
  })

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

  it('should not consider files that have fewer than two dots in them', function(done) {
    fileOperatedOn = bootstrap(['test/temp/robots.txt'])

    expect(fileOperatedOn.robots).to.be('robots.txt')
    done()
  })

  it('should distinguish between script.js and script.js.map', function(done) {
    fileOperatedOn = bootstrap(['test/temp/*script.js'])

    expect(fileOperatedOn.scriptMap).to.be('script.js.map')
    expect(fileOperatedOn.script).to.be('69fjamc.script.js')
    done()
  })
})
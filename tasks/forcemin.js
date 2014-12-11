/*
 * grunt-forcemin
 * https://github.com/msafi/grunt-forcemin
 *
 * Public domain. (Unlicensed)
 */
'use strict';

module.exports = function(grunt) {
  var path = require('path')

  grunt.registerMultiTask('forcemin', 'Mindlessly updates references to revisioned files in your source code to bust browser cache', function() {
    var unversionedFilename = ''
    var dictionary = {}
    var regexPattern = ''
    var filenamesArr = []
    var filteredFilesArr = []
    var readOnlyFiles = this.data.options ? this.data.options.readOnly ? this.data.options.readOnly : [] : [];

    // First, build a dictionary
    this.files.forEach(function(f) {
      filteredFilesArr = f.src.filter(
        function(filepath) {
          if (!grunt.file.exists(filepath)) {
            grunt.log.warn('Source file "' + filepath + '" not found.')
            return false
          } else {
            return true
          }
        }
      )

      // Build a dictionary. Also build a filenamesArr to be used in generating the regex pattern
      filteredFilesArr.forEach(
        function(filepath) {
          var filename = path.basename(filepath)

          // Make sure there are at least two dots in the name. Otherwise it means the file is not versioned and should
          // not be added to the dictionary
          if (filename.match(/[.]/g).length < 2) {
            grunt.log.warn("\n'" + filename + '\' doesn\'t look revisioned. References to it won\'t be updated.\n')
            return
          }

          unversionedFilename = filename.replace(/^(.*?)\./, '')
          dictionary[unversionedFilename] = filename

          // Escape regex metacharacters in file names
          var escapedFilename = unversionedFilename.replace(/[^\w]/g, function(character) { return "\\" + character; })
          filenamesArr.push(escapedFilename)
        }
      )

      // Construct the regex pattern based on the info we gathered
      regexPattern = filenamesArr.join('|')
      regexPattern = "(\\.)?(?:" + regexPattern + ')(?!\\.)'
      regexPattern = new RegExp(regexPattern, 'g')

      // Scan the content of each file and mindlessly replace references
      filteredFilesArr.forEach(function(filepath) {
        grunt.log.write("\n" + filepath + ':\n')

        if(!grunt.file.isMatch(readOnlyFiles, filepath)) {
            var fileContents = grunt.file.read(filepath)
            var replacedSomething = false

            fileContents = fileContents.replace(regexPattern, function(match, $1) {
              // if match isn't preceded by a dot (mimicing a negative lookbehind)
              if ($1 === undefined) {
                replacedSomething = true
                grunt.log.write("    " + match + ' ').ok(dictionary[match])

                return dictionary[match]
              } else {
                return match
              }
            })

            if (!replacedSomething)
              grunt.log.write('    Nothing was replaced here' + '\n')

            grunt.file.write(filepath, fileContents)
        } else {
            grunt.log.write('    Configured as read only, skipping.\n');
        }
      })
    })
  })
}

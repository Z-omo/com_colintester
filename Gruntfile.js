/**
 * JavaScript file: Gruntfile.js defines development tasks for
 * colintester.com website.
 *
 * @package     OnFocus
 * @author      Colin Tester <office@z-omo.com>
 * 
 * This file forms part of the installed @package and should not be copied 
 * and/or distributed without the written consent from the file's author.
 *
 * @copyright: Please see: <https://en.wikipedia.org/wiki/Berne_Convention>
 *
 * This file and its @package are under version control.
 */

'use strict';

module.exports = function(grunt) {
  const gruntConfig = {
    pkg:  grunt.file.readJSON('package.json')
  };

  // initialise grunt config and load external tasks:
  grunt.initConfig(gruntConfig);
  grunt.loadTasks('grunt-tasks');

  // define and register development tasks:
  const dev = ['sass:dev', 'browserify:dev', 'watch'];
  grunt.registerTask('dev', dev);

  // register default task runs:
  grunt.registerTask('default', dev);

  // Inserts (includes) page common HTML content:
  grunt.registerTask('insertHTML', ['replace:insertHTML']);

  // define and register public site build tasks:
  const build = [
    'shell:clearBuild',
    'shell:build',
    'replace:localLinks',
    'sass:build',
    'browserify:build',
    'uglify:build',
    'hashres:build',
    'htmlmin:build'
  ];
  grunt.registerTask('build', build);
}
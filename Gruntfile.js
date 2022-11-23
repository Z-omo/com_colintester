module.exports = function(grunt) {
  const gruntConfig = {
    pkg:  grunt.file.readJSON('package.json')
  };

  // initialise grunt config and load external tasks:
  grunt.initConfig(gruntConfig);
  grunt.loadTasks('grunt-tasks');

  // define development task runs:
  const dev = ['sass:dev', 'browserify:dev', 'watch'];

  // register task runs:
  grunt.registerTask('default', dev);

  // Inserts (includes) page common HTML content:
  grunt.registerTask('insertHTML', ['replace:insertHTML']);

  // define and register public site build tasks:
  const build = ['shell:build', 'sass:build', 'browserify:build'];
  grunt.registerTask('build', build);

}
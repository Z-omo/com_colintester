module.exports = function(grunt) {
  const gruntConfig = {
    pkg:  grunt.file.readJSON('package.json')
  };

  // initialise grunt config and load external tasks:
  grunt.initConfig(gruntConfig);
  grunt.loadTasks('grunt-tasks');

  // define task runs:
  const dev = ['sass:dev', 'browserify:dev', 'watch'];

  // register task runs:
  grunt.registerTask('default', dev);
}
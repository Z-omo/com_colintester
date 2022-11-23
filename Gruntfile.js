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
    'shell:build', 'sass:build', 'browserify:build', 'uglify:build'
  ];
  grunt.registerTask('build', build);
}
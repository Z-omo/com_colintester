module.exports = function(grunt) {
  const config = grunt.config.get('pkg.config');

  const tasks = {
    options: { livereload: true, livereloadOnError: false },

    // changes to src/js:
    js: {
      files: `${config.srcPath}js/*.js`,
      tasks: ['browserify:dev']
    },

    // changes to src/sass files:
    sass: {
      files: `${config.srcPath}sass/*.{scss,sass}`,
      tasks: ['sass:dev']
    },

    // whenever page common content (src/html) is updated:
    pageCommonContent: {
      files: `${config.srcPath}html/*.html`,
      tasks: ['replace:insertHTML'],
      options: { livereload: false }
    },

    // changes to html files within /local folder:
    html: {
      files: `${config.devPath}**/*.html`,
    }
  }

  grunt.config('watch', tasks);
  grunt.loadNpmTasks('grunt-contrib-watch');
};
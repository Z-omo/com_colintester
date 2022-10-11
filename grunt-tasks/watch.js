module.exports = function(grunt) {
  const config = grunt.config.get('pkg.config');

  const tasks = {
    options: { livereload: true, livereloadOnError: false },

    js: {
      files: `${config.srcPath}js/*.js`,
      tasks: ['browserify:dev']
    },

    sass: {
      files: `${config.srcPath}sass/*.{scss,sass}`,
      tasks: ['sass:dev']
    },

    pageCommonContent: {
      files: `${config.srcPath}html/*.html`,
      tasks: ['replace:insertHTML'],
      options: { livereload: false }
    },

    html: {
      files: `${config.devPath}**/*.html`,
    }
  }

  grunt.config('watch', tasks);
  grunt.loadNpmTasks('grunt-contrib-watch');
};
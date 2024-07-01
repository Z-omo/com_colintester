module.exports = function(grunt) {
  const config = grunt.config.get('pkg.config');

  const tasks = {
    build: {
      options: {
        comments: false,
        quotes:   true,
      },

      expand: true,
      cwd: config.buildPath,
      src: [`**/*.html`],
      dest: config.buildPath,
    }
  }

  grunt.config('minifyHtml', tasks);
  grunt.loadNpmTasks('grunt-minify-html');
};
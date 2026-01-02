module.exports = function(grunt) {
  const config = grunt.config.get('pkg.config');

  const tasks = {
    build: {
      options: {
        html5: true,
        removeComments:               true,
        collapseWhitespace:           true,
        collapseInlineTagWhitespace:  false,
        removeEmptyAttributes:        true,
        removeCommentsFromCDATA:      true,
        removeRedundantAttributes:    true,
        minifyCSS:                    true,
        minifyJS:                     true,
        quoteCharacter:               '"',
      },

      expand: true,
      cwd: config.buildPath,
      src: [`**/*.html`],
      dest: config.buildPath,
    }
  }

  grunt.config('htmlmin', tasks);
  // grunt.loadNpmTasks('grunt-contrib-htmlmin');
};
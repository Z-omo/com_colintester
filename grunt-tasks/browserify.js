module.exports = function(grunt) {
  const config = grunt.config.get('pkg.config');

  const tasks = {
    options: {
      transform: [['babelify', { presets: ['@babel/preset-env'] }]],
      debug: true
    },
    dev: {
      files: [{
        src: `${config.srcPath}js/index.js`,
        dest: `${config.devPath}js/${config.buildName}.js`
      }]
    }
  }

  grunt.config('browserify', tasks);
  grunt.loadNpmTasks('grunt-browserify');
};
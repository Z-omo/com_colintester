module.exports = function(grunt) {
  const config = grunt.config.get('pkg.config');
  
  const tasks = {
    options: { compress: { drop_console: true }, mangle: true },

    build: {
      files: [{
        src: `${config.buildPath}js/${config.buildName}.js`,
        dest: `${config.buildPath}js/${config.buildName}.js`
      }]
    }
  }

  grunt.config('uglify', tasks);
  grunt.loadNpmTasks('grunt-contrib-uglify');
}
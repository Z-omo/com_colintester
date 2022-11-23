module.exports = function(grunt) {
  const config = grunt.config.get('pkg.config');
  
  const tasks = {
    options: { style: 'nested', sourcemap: 'auto' },
    dev: {
      files: [{
        src:  `${config.srcPath}sass/bootstrap.sass`,
        dest: `${config.devPath}css/${config.buildName}.css`
      }]
    },

    build: {
      options: { style: 'compressed', sourcemap: 'none' },
      files: [{
        src:  `${config.srcPath}sass/bootstrap.sass`,
        dest: `${config.buildPath}css/${config.buildName}.css`
      }]
    }
  }

  grunt.config('sass', tasks);
  grunt.loadNpmTasks('grunt-contrib-sass');
}
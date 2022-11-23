module.exports = function(grunt) {
  const config = grunt.config.get('pkg.config');
  
  const tasks = {
    options: {
      encoding:       'utf8',
      fileNameFormat: '${name}.${hash}.${ext}',
      renameFiles:    true
    },

    build: {
      src: [
        `${config.buildPath}css/${config.buildName}.css`,
        `${config.buildPath}js/${config.buildName}.js`
      ],

      dest: `${config.buildPath}**/*.html`
    }
  }

  grunt.config('hashres', tasks);
  grunt.loadNpmTasks('grunt-hashres');
}
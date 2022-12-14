module.exports = function(grunt) {
  const config = grunt.config.get('pkg.config');
  const fileFilter = '--filter="merge rsync-file-filter.txt"'
  
  const tasks = {
    options:  { stdout: true, stderr: true },

    clearBuild: {
      command: `rm -f ${config.buildPath}css/*.css ${config.buildPath}js/*.js`
    },

    build: {
      command: `rsync -a ${fileFilter} ${config.devPath} ${config.buildPath}`
    }
  }

  grunt.config('shell', tasks);
  grunt.loadNpmTasks('grunt-shell');
}
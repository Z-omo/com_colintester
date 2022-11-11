const fs = require('fs');

module.exports = function(grunt) {
  const config = grunt.config.get('pkg.config');

  const memo = {}; // collection of memoized filename content.

  // function to handle callback from replace task.
  const replaceWithFile = (match, offset, string, captured) => {
    const fileName = captured[1];
    const filePath = `${config.includePath}${fileName}.html`;

    if (!fs.existsSync(filePath)) { return match; }

    // cache content of filename:
    if (!memo[fileName]) {
      console.log('Reading for insertion: ', fileName);
      memo[fileName] = fs.readFileSync(filePath, (err, data) => {
        if (err) { throw err; }
        return data;
      });
    }

    // return the insert comments wrapped around file content:
    return `${captured[0]}\n${memo[fileName]}\n${captured[2]}`;
  };

  const tasks = {
    options: { overwrite: true },

    insertHTML: {
      replacements:
      [{
        from: /(<\!-- insert \"(.*)\" -->)[\s\S]*?(<\!-- end insert -->)/ig,
        to:   replaceWithFile
      }],
  
      overwrite: true,

      src: [`${config.devPath}**/*.html`]
    }
  };

  grunt.config('replace', tasks);
  grunt.loadNpmTasks('grunt-text-replace');
};
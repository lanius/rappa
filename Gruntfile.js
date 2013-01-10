module.exports = function(grunt) {

  var fs = require('fs');
  var _ = require('lodash');

  var ext = function(suffix) {
    var result = 'extension';
    if (suffix) {
      return result + '/' + suffix;
    }
    return result;
  };
  var withoutTest = _.filter(fs.readdirSync(ext()), function(d) {
    return d != 'test' && fs.statSync(ext(d)).isDirectory();
  });
  var jsFiles = function(name) {
    return ext(name + '/js/**/*.js');
  };
  var pkg = grunt.file.readJSON('package.json');
  grunt.initConfig({
    pkg : pkg,
    jshint : {
      all : ['Gruntfile.js', jsFiles('background'), jsFiles('content'), jsFiles('options')]
    },
    copy : {
      extension : {
        files : {
          'build/extension/' : _.map(withoutTest, function(dir) {
            return ext(dir + '/**');
          })
        }
      }
    },
    compress : {
      extension : {
        options : {
          cwd : 'build/extension'
        },
        files : {
          'build/<%= pkg.name %>-<%= pkg.version %>.<%= grunt.template.today("yyyymmdd_HHMMss") %>.zip' : 'build/extension/**'
        }
      }
    }
  });

  grunt.registerTask('test', 'run tests', function() {
    var child = grunt.util.spawn({
      cmd : 'testacular',
      args : 'start test/unit/options.conf.js --single-run'.split(' ')
    }, this.async());
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });

  grunt.registerTask('manifest', 'make manifest.json without test configuration.', function() {
    var srcJson = 'extension/manifest.json';
    var manifest = grunt.file.readJSON(srcJson);
    manifest.version = pkg.version;
    var bgfiles = manifest.background.scripts;
    manifest.background.scripts = _.filter(bgfiles, function(path) {
      var re = /test\/.*/;
      return re.test(path) === false;
    });
    grunt.file.write('build/' + srcJson, JSON.stringify(manifest));
  });

  grunt.registerTask('template', 'process handlebars precompilation', function() {
    grunt.util.spawn({
      cmd : 'handlebars',
      args : 'template -f extension/content/lib/templates.js -m -o -k each -k if -k unless'.split(' ')
    }, this.async());
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('default', ['template', 'test', 'copy', 'manifest', 'compress']);
};

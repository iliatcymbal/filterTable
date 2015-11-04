/**
 * Created by Ilya on 12.10.2015.
 */

module.exports = function (grunt) {
  var config = require('config'),
    paths = config.get('paths'),
    names = config.get('fileNames'),
    prodFolder = [paths.views, paths.prodFolder].join('/'),

    pathToScripts = [paths.views, paths.scripts].join('/'),
    srcScripts = pathToScripts + '/*.js',
    srcProdFolderJS = [prodFolder, paths.prodScripts + '/'].join('/'),
    buildJS = srcProdFolderJS + names.buildJS,
    minJS = srcProdFolderJS + names.minJS,

    srcCSS = [paths.views, paths.styles].join('/') + '/*.css',
    srcProdFolderCSS = [prodFolder, paths.prodCSS + '/'].join('/'),
    minCSS = srcProdFolderCSS + names.allCSS;

  grunt.initConfig({
    paths: paths,
    clean: [prodFolder],
    jshint: {
      files: ['Gruntfile.js', srcScripts],
      options: {
        ignores: [buildJS, minJS]
      }
    },
    watch: {
      scripts: {
        files: ['*.js', srcScripts],
        tasks: ['jshint'],
        options: {
          reload: true
        }
      }
    },
    concat: {
      options: {
        separator: '\n'
      },
      dist: {
        src: [pathToScripts + '/utils.js', srcScripts],
        dest: buildJS
      }
    },
    uglify: {
      dist: {
        src: [buildJS],
        dest: minJS
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: [{
          expaand: true,
          src: [srcCSS],
          dest: minCSS
        }]
      }
    }
  });

  var tasks = ['clean', 'jshint', 'concat', 'uglify', 'cssmin'],
    max = tasks.length,
    index = tasks.length;

  while (index--) {
    grunt.loadNpmTasks('grunt-contrib-' + tasks[max - index - 1]);
  }

  grunt.registerTask('default', tasks);

};

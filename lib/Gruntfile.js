module.exports = function(grunt) {

  grunt.initConfig({
      browserify: {
      js: {
          src: ['../javascript/main.js'],
          dest: '../dist/app.js'
      }
    },
    jshint: {
      files: ['../javascript/**/*.js'],
      options: {
        predef: [ "document", "console", "$", "firebase", "FbAPI"],
        esnext: true,
        globalstrict: true,
        globals: {},
        browserify: true
      }
    },
     sass: {
      dist: {
        files: {
          '../styles/main.css': '../sass/main.scss'
        }
      }
    },
    watch: {
      javascripts: {
        files: ['../javascript/**/*.js'],
        tasks: ['jshint', 'browserify']
      },
      sassy: {
        files: ['../sass/**/*.scss'],
        tasks: ['sass']
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['sass', 'browserify', 'jshint', 'watch']);
};
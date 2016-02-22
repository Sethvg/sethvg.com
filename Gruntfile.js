/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    connect: {
      server: {
        options: {
          livereload:true,
          keepalive:true,
          port: 9000,
          base:{
            path:'.',
            options: {
              index: 'index.html',
              maxAge: 300000
            }
          }
        }
      }
    }

  });


  grunt.loadNpmTasks('grunt-contrib-connect');

};

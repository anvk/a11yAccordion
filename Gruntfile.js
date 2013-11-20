module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      main: {
        files: [
          {expand: true, src: ['!assets/imgs/image.jpg', 'assets/imgs/*'], flatten: true, dest: 'dist/imgs/', filter: 'isFile'} // includes files in path
        ]
      }
    },
    less: {
      development: {
        options: {
          paths: ["css"]
        },
        files: {
          "dist/css/<%= pkg.name %>.css": "assets/a11yAccordeon.less"
        }
      },
      production: {
        options: {
          paths: ["css"],
          yuicompress: true
        },
        files: {
          "dist/css/<%= pkg.name %>.css": "assets/a11yAccordeon.less"
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['!js/libs', 'js/**/*.js'],
        dest: 'dist/js/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> / Last build on: <%= grunt.template.today("dd-mm-yyyy") %> / This file is under <%= pkg.version %> license. */\n'
      },
      my_target: {
        files: {
          'dist/js/<%= pkg.name %>-<%= pkg.version %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['copy', 'less', 'concat', 'uglify']);
};
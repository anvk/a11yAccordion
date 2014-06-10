module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      production: {
        src: [ 'dist' ]
      },
    },
    copy: {
      main: {
        files: [
          {expand: true, src: ['!assets/imgs/image.jpg', 'assets/imgs/*'], flatten: true, dest: 'dist/imgs/', filter: 'isFile'} // includes files in path
        ]
      }
    },
    less: {
      production: {
        options: {
          paths: ["css"]
        },
        files: {
          "dist/css/<%= pkg.name %>.css": "assets/a11yAccordion.less"
        }
      }
    },
    cssmin: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> / Last build on: <%= grunt.template.today("dd-mm-yyyy") %> / This file is under <%= pkg.version %> license. */'
      },
      production: {
        expand: true,
        cwd: 'dist/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/',
        ext: '.min.css'
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      production: {
        src: ['!js/libs', 'js/**/*.js'],
        dest: 'dist/js/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> / Last build on: <%= grunt.template.today("dd-mm-yyyy") %> / This file is under <%= pkg.license %> license. */\n'
      },
      production: {
        files: {
          'dist/js/<%= pkg.name %>-<%= pkg.version %>.min.js': ['<%= concat.production.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['clean', 'copy', 'less', 'cssmin', 'concat', 'uglify']);
  grunt.registerTask('css', ['less', 'cssmin']);
};
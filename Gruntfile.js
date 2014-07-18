// global module:false
var pleeeaseNavigators = [
    'last 15 versions',
    'Firefox 4',
    'Opera 1',
    "Android 1",
    "BlackBerry 1",
    "Chrome 1",
    "Explorer 1",
    "iOS 1",
    "Opera 1",
    "Safari 1"
];

// CSS files to consider for grunt less / pleeease task
var cssFiles = [
    "styles"
];

// usage
// from : the folder where file exists
// froExt : the extension of files in this folder
// to : the destination of file
// toExt : the new extension of copied/modified files
var cssFromTo = function (from, fromExt, to, toExt) {
    var files = {};
    for (var i in cssFiles) {
        files[to + cssFiles[i] + '.' + toExt] = from + cssFiles[i] + '.' + fromExt;
    }
    return files;
};

// grunt task
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            options: {
                'no-write': false,
            },
            sim: [
                'htdocs/styles/*',
                'htdocs/js/*'
            ]
        },

        jshint: {
            // doc http://www.jshint.com/docs/
            options: {
                globals: {
                    //jQuery: true
                    //console: true,
                    //module: true
                }
            },
            files: ['Gruntfile.js', 'htdocs/**/*.js']
        },

        copy: {
            third: {
                files: [{   // angular
                    expand: true,
                    cwd: 'bower_components/angular',
                    src: ['angular.min.js'],
                    dest: 'htdocs/js/static/'
                }, {    // angular-bootstrap
                    expand: true,
                    cwd: 'bower_components/angular-bootstrap',
                    src: ['ui-bootstrap.min.js'],
                    dest: 'htdocs/js/static/'
                }, ]
            },
        },

        less: {
            dev: {
                files: cssFromTo('less/', 'less', 'tmp/', 'css')
            }
        },

        // css post treatment
        pleeease: {
            dev: {
                options: {
                    fallbacks: {
                        autoprefixer: pleeeaseNavigators
                    },
                    optimizers: {
                        minifier: false, // default = true
                        import: false, // default = true
                        mqpacker: false // media query packer : default = true
                    }
                },
                files: cssFromTo('tmp/', 'css', 'htdocs/styles/', 'css')
            }
        },

        // debug https://github.com/gruntjs/grunt-contrib-watch/blob/master/docs/watch-options.md
        watch: {
            less: {
                options: {
                    spawn: false, // faster but buggy
                    livereload: false,
                    interrupt: true,
                },
                files: ['less/**/*.less'],
                tasks: ['less'],
            },
            pleeease: {
                options: {
                    spawn: false, // faster but buggy
                    livereload: false,
                    interrupt: true,
                },
                files: ['tmp/**/*.css'],
                tasks: ['pleeease'],
            },
            livereload: {
                options: {
                    livereload: true,
                },
                files: ['htdocs/**/*']
            }
        }
    });

    // grunt functions only reload one file
    grunt.event.on('watch', function (action, filepath, target) {
        switch (target) {
        case 'livereload':
            grunt.config('watch.livereload.files', filepath);
            break;
        }
    });

    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt);

    // Tasks for watch
    grunt.registerTask('create-js', ['clean', 'jshint', 'copy']);
    grunt.registerTask('create-css', ['less', 'pleeease']);

    grunt.registerTask('prod', ['create-js', 'create-css']);

    // Default task.
    grunt.registerTask('build', ['create-js', 'create-css']);

    grunt.registerTask('default', 'build');
};
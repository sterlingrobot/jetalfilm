'use strict';
var ngrok = require('ngrok');
module.exports = function(grunt) {
    // Unified Watch Object
    var watchFiles = {
        clientJS: ['js/*.js'],
        clientCSS: ['css/*.css']
    };
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            clientJS: {
                files: watchFiles.clientJS,
                tasks: ['jshint', 'concat', 'uglify'],
                options: {
                    livereload: true
                }
            },
            clientCSS: {
                files: watchFiles.clientCSS,
                tasks: ['csslint', 'concat', 'postcss'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            all: {
                src: watchFiles.clientJS,
                options: {
                    jshintrc: true
                }
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            all: {
                src: watchFiles.clientCSS
            }
        },
        // Remove previously generated builds
        clean: {
            output: ['output'],
            dist: ['dist']
        },
        // Copy things to a temp dir, and only change things in the temp dir
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '',
                    src: ['*.html', 'css/**', 'js/**'],
                    dest: 'output/'
                }]
            }
        },
        useref: {
            html: 'output/**/*.html',
            temp: 'output'
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    useShortDoctype: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    minifyJS: true
                },
                files: { // Dictionary of files - Use build block outputs from useref
                    'dist/index.html': 'output/index.html'
                }
            },
        },
        pagespeed: {
            options: {
                nokey: true,
                url: "",
                locale: "en_US",
                threshold: 90
            },
            mobile: {
                options: {
                    strategy: "mobile"
                }
            }
        },
        imagemin: {
            options: {
                optimizationLevel: 3
            },
            dynamic: {
                files: [{
                    expand: true,
                    src: ['img/*.{png,jpg,gif}'],
                    dest: 'dist/'
                }]
            }
        }
    });

    // Load NPM tasks automatically vs calling loadNpmTasks for each
    require('load-grunt-tasks')(grunt);

    // Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    grunt.registerTask('default', ['lint', 'build', 'psi-ngrok', 'watch' ]);
    grunt.registerTask('lint', ['jshint', 'csslint']);
    grunt.registerTask('build', ['remove', 'copy', 'useref', 'optimize']);
    grunt.registerTask('optimize', ['newer:postcss', 'newer:concat', 'newer:uglify', 'newer:htmlmin', 'newer:imagemin']);
    grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
        var done = this.async();
        var port = 8083;
        ngrok.connect(port, function(err, url) {
            if (err !== null) {
                grunt.fail.fatal(err);
                return done();
            }
            grunt.config.set('pagespeed.options.url', url);
            grunt.task.run('pagespeed');
            done(function() {
                // Disconnect after testing
                ngrok.disconnect();
            });
        });
    });
};
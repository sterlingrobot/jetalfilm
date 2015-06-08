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
            output: {
                files: [{
                    expand: true,
                    cwd: '',
                    src: ['*.html', 'css/**', 'js/**', '!node_modules/**', '!vendor/**', 'vendor/bootstrap/dist/css/bootstrap.min.css', 'vendor/bootstrap/dist/js/bootstrap.min.js', 'vendor/jquery/dist/jquery.min.js'],
                    dest: 'output/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'output/',
                    src: ['css/jetal.min.css', 'js/jetal.min.js'],
                    dest: 'dist/'
                }]
            }
        },
        useref: {
            html: 'output/**/*.html',
            temp: 'output'
        },
        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer-core')({
                        browsers: 'last 2 versions'
                    }),
                    require('csswring')
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'output/',
                    src: ['css/*.css'],
                    dest: 'dist/',
                    ext: '.min.css'
                }]
            }
        },
        // concat: {
        //     options: {},
        //     dist: {
        //         files: {
        //             'output/js/<%= pkg.name %>.js': ['output/js/*.js']
        //         }
        //     }
        // },
        // uglify: {
        //     options: {
        //         // the banner is inserted at the top of the output
        //         banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        //     },
        //     dist: {
        //         files: {
        //             'dist/js/<%= pkg.name %>.min.js': ['output/js/jetal.min.js']
        //         }
        //     }
        // },
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
            dist: {
                files: [{
                    expand: true,
                    src: ['img/*.{png,jpg,gif}', '*.ico'],
                    dest: 'dist/'
                }]
            }
        },
        'sftp-deploy': {
            dist: {
                auth: {
                    host: 'jetalfilm.com',
                    port: 22,
                    authKey: 'tor'
                },
                cache: 'sftpCache.json',
                src: 'dist/',
                dest: '/home/tor/www/dist/',
                exclusions: [],
                serverSep: '/',
                concurrency: 4,
                progress: true
            }
        }
    });
    // Load NPM tasks automatically vs calling loadNpmTasks for each
    require('load-grunt-tasks')(grunt);
    // Making grunt default to force in order not to break the project.
    grunt.option('force', true);
    grunt.registerTask('default', ['lint', 'build', 'psi-ngrok', 'watch']);
    grunt.registerTask('lint', ['jshint', 'csslint']);
    grunt.registerTask('build', ['clean', 'copy:output', 'useref', 'optimize']);
    grunt.registerTask('optimize', ['postcss', 'concat', 'uglify', 'htmlmin', 'imagemin']);
    grunt.registerTask('deploy', ['copy:dist', 'sftp-deploy']);
    grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
        var done = this.async();
        var port = 8084;
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
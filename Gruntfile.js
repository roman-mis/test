// Generated on 2014-10-07 using generator-angular 0.9.8
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
// var _=require('lodash');
module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };
  //environment variable config
  var localConfig;
  try {
    localConfig = require('./server/config/local.env');
    //console.log(localConfig);
  }catch(e){
    localConfig = {};
  }
  //for nicer address handling
  var modRewrite = require('connect-modrewrite');
  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,
    develop: {
      server: {
        file: 'server/app.js'
      }
    },
    env: {
      test: { NODE_ENV: 'test' },
      prod: { NODE_ENV: 'production' },
      all: localConfig

    },
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      nodejs: {
        files: [
          'server/**/*.js',
          'server/**/*.json',
          'server/*.js'
        ],
        tasks: ['env:all','develop'],
        options: { nospawn: true }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      proxies: [
        {
          context: ['/api','/authenticate','/signup','/public','/constants'],
          host: 'localhost',
          port: 3000,
          https: false,
          changeOrigin: false
        }
      ],
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              proxy,
              modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.gif|\\.jpg|\\.ttf|\\.woff|\\.otf|\\.eot|\\.swf$ /index.html [L]']),
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              proxy,
              modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.gif|\\.jpg|\\.ttf|\\.woff|\\.otf|\\.eot|\\.swf$ /index.html [L]']),
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: 'client.jshintrc',
        reporter: require('jshint-stylish'),
		force : true
      },
      client: {
        src: [
          'Gruntfile.js',
          ['<%= yeoman.app %>/scripts/{,*/}*.js','!<%= yeoman.app %>/scripts/vendors/**/*']
        ]
      },
	  server: {
		  options: {
			jshintrc: 'server.jshintrc',
			reporter: require('jshint-stylish')
		  },
        src: [
          'server/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp',
      coverageServer:{
        src:['coverage/']
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      sass: {
        src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: './bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/**/*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>','<%= yeoman.dist %>/images']
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images/'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: ['*.js', '!oldieshim.js'],
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/**/*.html',
            'images/{,*/}*.{webp}'
          ]
        },{
          expand: true,
          flatten:true,
          cwd: '<%= yeoman.app %>/../bower_components/',
          dest: '<%= yeoman.dist %>/fonts',
          src: [
            'bootstrap-sass-official/assets/fonts/bootstrap/*.{eot,ttf,woff,svg,otf}',
            'components-font-awesome/fonts/*.{eot,ttf,woff,svg,otf}'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      coverageServer:{
        src:['test/server/**'],
        dest:'coverage/'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },
    blanket:{
      coverage:{
        src:['server/'],
        dest:'coverage/server/'
      }
    },
    mochaTest:{
      test:{
        options:{
          reporter:'spec',
          captureFile:'results.txt',
          quiet:false,
          clearRequireCache:false
        },
        src:['test/**/*.js']
      },
      server:{
        options:{
          reporter:'spec',
          captureFile:'server_results.txt',
          require:['test/server/startup.js'],
          quiet:false,
          clearRequireCache:false
        },
        src:['test/server/**/*.js']
      },
      serverCoverage:{
        options:{
          reporter:'html-cov',
          quiet:true,
          captureFile:'coverage.html'
        },
        src:['coverage/test/server/**/*.js']
        
      }
    },
    protractor_webdriver: {
      options: {
        // Task-specific options go here.
      },
      test: {}
    },
    protractor: {
      options: {
        configFile: "test/e2e/conf.js", // Default config file
        keepAlive: false, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        args: {
          // Arguments passed to the command
        }
      },
      all: {},
    }
  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'env:all',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'configureProxies',
      'develop',
      'watch'

    ]);
  });

  grunt.loadNpmTasks('grunt-protractor-webdriver');

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('validate', [
     'jshint'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);
  grunt.registerTask('temp', [
    'clean:dist',

    'imagemin'

  ]);

  grunt.registerTask('disttest',[
    'build',
    'env:disttest',
    'concurrent:server',
    'autoprefixer',
    'connect:livereload',
    'configureProxies',
    'develop',
    'watch'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('mochatest',[
      'mochaTest:test'
    ]);

  grunt.registerTask('test', [
    'protractor_webdriver',
    'protractor'
  ]);

  var defaultServerTestSrc = grunt.config('mochaTest.server.src');
  grunt.event.on('watch', function(action, filepath) {
    grunt.config('mochaTest.server.src', defaultServerTestSrc);
    if (filepath.match('test/server/')) {
      grunt.config('mochaTest.server.src', filepath);
    }
  });

  grunt.registerTask('server.test',[
    'mochaTest:server'
    ]);

  grunt.registerTask('server.coverage',[
    'clean:coverageServer','blanket:coverage','copy:coverageServer','mochaTest:serverCoverage'
    /*'blanket:coverage','mochaTest:serverCoverage'*/
    ]);
};

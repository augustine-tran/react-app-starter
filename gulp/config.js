var dest = "./public";
var src = "./src";

var bowerSrc = "./bower_components";
var nodeSrc = "./node_modules";

var modRewrite = require('connect-modrewrite');

module.exports = {
  browserSync: {
    server: {
      // Serve up our build folder
      //baseDir: dest,
      //middleware: [
      //  modRewrite(['^[^\\.]*$ /index.html [L]'])
      //]
      proxy: "http://localhost:3000",
      port: 3010,
      ui: {
        port: 3011
      }

    }
  },
  nodemon: {
    script: './bin/www'
  },
  sass: {
    src: [
      src + "/assets/sass/**/*.{sass,scss}",
      src + "/components/**/*.{sass,scss}"
    ],
    dest: dest + "/css",
    settings: {
      //indentedSyntax: true, // Enable .sass syntax!
      imagePath: dest + "/img", // Used by the image-url helper
      includePaths: [
        bowerSrc + "/bootstrap-sass-official/assets/stylesheets"
      ],
      outputStyle: 'expanded'
    }
  },
  scripts: {
    src: [
      src + "/**/*.{js,jsx}"
    ],
    dest: dest + "/js",
    options: {
      entry: {
        app: src + "/app.jsx"
      },
      output: {
        filename: "[name].js"
      },
      debug: true,
      watch: false,
      module: {
        preLoaders: [
            { test: /\.jsx?$/, exclude: /node_modules/, loader: 'jsxhint-loader' }
        ],
        loaders: [
          { test: /\.jsx?$/, loader: 'jsx-loader' } // TODO: Recommended to use JSX extension only for JS files.
        ],
        noParse: /\.min\.js/,
        jshint: {
          browser: true,
          curly: true,
          unused: true,

          // jshint errors are displayed by default as warnings
          // set emitErrors to true to display them as errors
          emitErrors: false,

          // jshint to not interrupt the compilation
          // if you want any file with jshint errors to fail
          // set failOnHint to true
          failOnHint: false
        }
      },
      resolve: {
        // Tell webpack to look for required files in bower and node
        modulesDirectories: [bowerSrc, nodeSrc]
      }
    }
  },
  images: {
    src: [
      src + "/assets/img/**/*.{png,jpg,jpeg,gif,svg}",
      src + "/components/**/*.{png,jpg,jpeg,gif,svg}"
    ],
    dest: dest + "/img"
  },
  fonts: {
    src: [
      src + "/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}",
      src + "/components/**/*.{eot,svg,ttf,woff,woff2}"
    ],
    dest: dest + "/fonts",
    filter: "**/*.{eot,svg,ttf,woff,woff2}"
  },
  markup: {
    src: src + "/**/*.html",
    dest: dest
  },
  clean: {
    folders: [
      dest
    ]
  },
  production: {
    cssSrc: dest + '/css/*.css',
    jsSrc: dest + '/js/*.js',
    jslint: {
      options: {
        node: true
      }
    },
    dest: dest
  }
};

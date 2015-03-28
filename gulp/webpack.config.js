module.exports = function (src, bowerSrc, nodeSrc) {
    return {
        output: {
            filename: "[name].js"
        },
        debug: true,
        watch: false,
        module: {
            preLoaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'eslint-loader'
                }
            ],
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader?experimental'
                }
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
};

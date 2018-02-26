const path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/main.js',
    target: "node",
    externals: [nodeExternals()],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};
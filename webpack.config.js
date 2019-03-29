const webpack = require('webpack');
const path = require('path');
// const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = {
    entry: './app.jsx',

    output: {
        filename: '[name].js'
    },

    mode: 'development',

    devtool: 'inline-source-map',

    resolve: {extensions: ['.js', '.jsx', '.ts', '.tsx']},

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        hot: true,
        port: 8000
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react'],
                    plugins: ['transform-class-properties'],
                },
                exclude: [
                    path.resolve(__dirname, 'node_modules'),
                ],
            },

            // {
            // 	test: /\.jsx?$/,
            // 	exclude: [
            // 		path.resolve(__dirname, 'node_modules'),
            // 		path.resolve(__dirname, 'bundle.js'),
            // 	],
            // 	loader: 'eslint-loader',
            // },

            // {
            //     test: /\.jsx?$/,
            //     loader: 'jsx-loader',
            //     exclude: [
            //         path.resolve(__dirname, 'node_modules'),
            //     ]
            // },

            {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'sass-loader'
                }]
            }
        ]
    },

    // plugins: [
    //     new WriteFilePlugin(),
    //     new webpack.HotModuleReplacementPlugin()
    // ]

    // plugins: [new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //         warnings: false,
    //         pure_funcs: ['console.log', 'window.console.log.apply']
    //     },
    // })]
};
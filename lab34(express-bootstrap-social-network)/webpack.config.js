const path = require('path');
const FileManagerPlugin = require("filemanager-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: 'production',
    entry: {
        users: path.join(__dirname, 'public', 'javascripts', 'users.js'),
        index: path.join(__dirname, 'public', 'javascripts', 'index.js')
    },
    output: {
        path: path.resolve(__dirname, 'public', 'webpack'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                exclude: /node_modules/,
                loader: 'pug-loader',
                options: {
                    pretty: true
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                }
            },
            {
                test: /\.(css|less)$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(png|jpg|jpeg|ico|svg)/,
                exclude: /node_modules/,
                type: 'asset/resource',
                loader: 'file-loader',
                options: {
                    name: 'images/static/[name].[ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                exclude: /node_modules/,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new FileManagerPlugin({
            events: {
                onStart: {
                    delete: ['public/webpack'],
                }
            },
        }),
        new HtmlWebpackPlugin(({
            template: `./views/index.pug`,
            filename: `./index.html`,
            chunks: ['index']
        }))
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
        ],
    }
}
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry:{
        login: path.resolve(__dirname, 'src/login.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    devServer: {
       static: {
        directory: path.resolve(__dirname, 'dist')
       },
       port: 3000,
       open: true,
       hot: true,
       compress: true,
       historyApiFallback: {
        index: '/login.html',
       },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack App',
            filename: 'login.html',
            template: 'src/login.html'
        }), 
    ],
}

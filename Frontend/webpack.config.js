const path = require('path')

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
       historyApiFallback: true  
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
}

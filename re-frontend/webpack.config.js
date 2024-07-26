const path = require('path')
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const { type } = require('os');

module.exports = {
    mode: "development",
    devtool: 'cheap-module-source-map',
    entry: {
        popup: path.resolve('./src/popup/popup.tsx'),
        options: path.resolve('./src/options/options.tsx'),
        background: path.resolve('./src/background/background.ts')
    },
    module: {
        rules:[
            {
                use: "ts-loader",
                test: /\.tsx$/,
                exclude: /node_modules/
            },
            {
                use: ['style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            ident: 'postcss',
                            plugins: [tailwindcss, autoprefixer],
                        },
                        },
                    }],
                    test: /\.css$/i,
            },
            {
                type: 'asset/resource',
                use: 'asset/resource',
                test: /\.(png|svg|jpg|jpeg|gif|svg)$/,
            },
        ]

    },
    plugins: [
        new CopyPlugin({
            patterns: [
              { 
                from: path.resolve('src/static'), 
                to: path.resolve('dist') 
            },
            ],
          }),
          ...getHtmlPlugins([
            'popup', 
            'options'
            ])
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].js'
    },

    optimization: {
        splitChunks: {
            chunks: 'all'
        },
    },
}

function getHtmlPlugins(chunks){
    return chunks.map(chunk => new HtmlPlugin({
        title: 'React Extension',
        filename: `${chunk}.html`,
        chunks: [chunk]
    }))
}
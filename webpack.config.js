const path = require('path');
const WebpackBarPlugin = require('webpackbar');
const { DefinePlugin } = require('webpack');

const production = process.env.NODE_ENV === 'production';

if (!production) {
    require('dotenv').config();
}

module.exports = {
    entry: {
        index: path.join(__dirname, 'src/index.ts'),
    },
    output: {
        path: path.join(__dirname, 'out'),
        filename: '[name].js'
    },
    devtool: production ? false : 'source-map',
    mode: 'development',
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.tsx?$/,
                use: 'ts-loader'
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            'src': path.resolve(__dirname, 'src/')
        }
    },
    node: {
        fs: 'empty',
        net: 'empty',
        readline: 'empty',
        'child_process': 'empty',
        dns: 'empty'
    },
    plugins: [
        new DefinePlugin({
            'global.process.env.LOG_LEVEL': '"debug"'
        }),
        new WebpackBarPlugin({
            name: 'LSIF TypeScript Server',
            color: 'green',
        }),
    ]
};

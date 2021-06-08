const CracoLessPlugin = require('craco-less');
const webpack = require('webpack');

const isProd = process.env.NODE_ENV === 'production';


// env 线上特殊配置设置
// env设置必须放到 webpack 配置合并之前
if (isProd) {

    // 关掉souremap
    process.env.GENERATE_SOURCEMAP = 'false';

}

module.exports = {
    webpack: {
        plugins: {
            add: [
                new webpack.ProgressPlugin(),
            ],
        },
        configure: (webpackConfig, {env}) => {
            const publicPath = process.env.CDN_PREFIX || '';
            webpackConfig.output.publicPath = env === 'production' ? publicPath : '/';

            // 开发环境修改入口
            if (!isProd) {
                webpackConfig.entry = ['react-hot-loader/patch', './src'];
            }

            return webpackConfig;
        },
    },
    babel: {
        plugins: [
            'babel-plugin-transform-typescript-metadata',
            ['@babel/plugin-proposal-decorators', {'legacy': true}],
            ['@babel/plugin-proposal-class-properties', {'loose': true}],
            'react-hot-loader/babel',
        ],
        presets: [
            '@babel/preset-typescript',
        ],
    },
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {'@primary-color': '#1890ff'},
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};

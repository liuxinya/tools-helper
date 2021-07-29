const path = require('path');

module.exports = {
  configureWebpack: config => {
    return {
        entry: path.join(__dirname, './examples/main.js'),
        devServer: {
            disableHostCheck: true,
            https: true,
            proxy: {
                '/api': {
                    target: 'https://qasandbox.bcetest.baidu.com',
                    secure: false,
                    changeOrigin: true,
                    headers: {
                        origin: '',
                    },
                },
            },
        }
    };
  },
  chainWebpack: config => {
    config.module
      .rule('js')
      .include
        .add(__dirname + 'src')
        .end()
      .use('babel')
        .loader('babel-loader')
        .tap(options => {
          // 修改它的选项...
          return options;
        });
  }
};

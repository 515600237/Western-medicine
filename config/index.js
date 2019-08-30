'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');

module.exports = {
  dev: {
    // userInfomation 登录，我的设置，人员信息   baseInfomation  科室，技能，专业等基础信息， restForm一龙接口
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // target: 'http://192.168.8.43:8080/westMedicine-user/',
    proxyTable: {
      '/userInfomation': {
        target: 'http://192.168.8.183/westMedicine-user/',
        changeOrigin: true,
        pathRewrite: {
          '^/userInfomation': '/'
        }
      },
      // target: 'http://192.168.8.43:8081/business/',
      // target: 'http://192.168.8.183/restForm/',
      '/restForm': {
        target: 'http://192.168.8.183/restForm/',
        changeOrigin: true,
        pathRewrite: {
          '^/restForm': '/'
        }
      },
      /*http://192.168.8.43:8085/westMedicine-admin/*/
      '/author': {
        target: 'http://192.168.8.43:8085/westMedicine-admin/',
        changeOrigin: true,
        pathRewrite: {
          '^/author': '/'
        }
      },
      '/file': {
        target: 'http://192.168.8.37:8088/',
        changeOrigin: true,
        pathRewrite: {
          '^/file': '/'
        }
      }
    },
    // Various Dev Server settings
    host: '192.168.8.171', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
};


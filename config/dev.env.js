'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  userRoot1: '"/userInfomation"',
  userRoot2: '"/restForm"',
/*  userRoot3: '"/restForm"',*/
  userRoot3:'"/author"',
  file: '"/file"',
});

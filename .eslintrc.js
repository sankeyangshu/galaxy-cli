/*
 * @Description: eslint 配置文件
 * @Author: 三棵杨树
 * @Date: 2022-09-11 21:09:19
 * @LastEditors: 三棵杨树
 * @LastEditTime: 2022-09-11 21:10:55
 */
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'standard',
    'plugin:prettier/recommended', // 添加 prettier 插件
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {},
};

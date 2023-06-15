<h1 align="center">
  <img src="https://raw.githubusercontent.com/sankeyangshu/sankeyangshu/master/image/logo-bai.png" width="80"/>
  <br>
  Galaxy-CLI-Utils
</h1>
<h4 align="center">一个用于快速生成各种前后端项目模版的脚手架 | Galaxy-CLI的工具库</h4>

<p align="center">
  <img src="https://img.shields.io/badge/Node-16.0.0-green" alt="flask version" data-canonical-src="https://img.shields.io/badge/Node-16.0.0-green" style="max-width:100%;">
  <img src="https://img.shields.io/badge/license-MIT-lightgrey" alt="LISENCE" data-canonical-src="https://img.shields.io/badge/license-MIT-lightgrey" style="max-width:100%;">
</p>

---

:star: :star: :star: :star: :star:

### 提示

现在 **galaxy-cli-utils 工具包** 暂停维护，该包内的功能已经集成到 [galaxy-cli-core](../core/README.md) 中，请访问 [galaxy-cli-core](../core/README.md)

## 简介

**galaxy-cli-utils** 是专门为 **Galaxy-CLI** 定制的工具包，提供了获取 Galaxy-CLI NPM 包信息和开发调试时 log 输出信息封装等一系列方法

## 使用

### 获取 npm 包信息

```javascript
const { getNpmInfo } = require('galaxy-cli-utils');

/**
 * @description: 获取npm包信息
 * @param {string} npmName npm包名称
 * @param {string} registry npm源
 * @return {Promise} npm包信息
 */
cont res = getNpmInfo(npmName,registry)
```

### 获取所有满足条件的版本号

```javascript
const { getNpmSemverVersion } = require('galaxy-cli-utils');

/**
 * @description: 获取所有满足条件的版本号
 * @param {string} baseVersion 基础版本号
 * @param {string} npmName npm包名称
 * @param {string} registry npm源
 * @return {Array} 版本数组
 */
const res = getNpmSemverVersion(baseVersion, npmName, registry);
// [1.0.0,1.0.1...]
```

### 获取最新版本号

```javascript
const { getNpmLatestVersion } = require('galaxy-cli-utils');

/**
 * @description: 获取最新版本号
 * @param {*} npmName npm包名称
 * @param {*} registry npm源
 * @return {*} 最新版本号
 */
const res = getNpmLatestVersion(npmName, registry);
// '1.0.9'
```

### log 封装

- [**log 使用**](./lib/utils/log.js)

## 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request

## 许可证

[MIT License](https://github.com/sankeyangshu/galaxy-cli/blob/master/LICENSE)

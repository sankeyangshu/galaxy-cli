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

## 如何贡献

你可以[提一个 issue](https://github.com/sankeyangshu/galaxy-cli/issues) 或者提交一个 Pull Request。

**Pull Request:**

1. Fork 代码
2. 创建自己的分支: `git checkout -b feat/xxxx`
3. 提交你的修改: `git commit -am 'feat(function): add xxxxx'`
4. 推送您的分支: `git push origin feat/xxxx`
5. 提交 `pull request`

## Git 贡献提交规范

- `feat`: 新增功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式（不影响功能，例如空格、分号等格式修正）
- `refactor`: 代码重构（不包括 bug 修复、功能新增）
- `perf`: 性能优化
- `test`: 添加、修改测试用例
- `build`: 构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）
- `ci`: 修改 CI 配置、脚本
- `chore`: 对构建过程或辅助工具和库的更改（不影响源文件、测试用例）
- `revert`: 回滚 commit

## 许可证

[MIT License](https://github.com/sankeyangshu/galaxy-cli/blob/master/LICENSE)

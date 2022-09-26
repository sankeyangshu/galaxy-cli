<h1 align="center">
  <br>
  Galaxy-CLI
</h1>
<h4 align="center">一个用于快速生成各种前后端项目模版的脚手架</h4>

<p align="center">
  <img src="https://img.shields.io/badge/Node-12.0.0-green" alt="flask version" data-canonical-src="https://img.shields.io/badge/Node-12.0.0-green" style="max-width:100%;">
  <img src="https://img.shields.io/badge/license-MIT-lightgrey" alt="LISENCE" data-canonical-src="https://img.shields.io/badge/license-MIT-lightgrey" style="max-width:100%;">
</p>
<p align="center">
  <a href="#简介">简介</a>&nbsp;|&nbsp;<a href="#快速开始">快速开始</a>
</p>

* * *
## 简介

### 什么是 Galaxy-CLI ？

Galaxy-CLI 是一个用于快速生成各种**前后端项目模版**的脚手架。Galaxy-CLI 可以有效的帮助开发者节省每次从零构建一个完整的项目环境的时间，避免开发者重复性工作。

### 软件架构

```bash
├── .husky                     # Git Hook 工具
├── packages                   # npm包源代码
│   ├── core                   # Galaxy-cli核心包
│   ├── utils                  # Galaxy-cli工具包
├── .editorconfig              # 编辑相关配置
├── .eslintignore              # eslint忽略文件
├── .eslintrc.js               # eslint 配置
├── .prettierrc                # Prettier 配置
├── commitlint.config.js       # 集成 commitlint 验证提交规范
├── lerna.json                 # lerna 配置
├── package.json               # package.json 依赖
```

## 快速开始

### 前序准备

你需要在本地安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)。本项目技术栈基于 [commander](https://github.com/tj/commander.js)、[inquirer](https://github.com/SBoudrias/Inquirer.js)、[axios](https://github.com/axios/axios)和[fs-extra](https://github.com/jprichardson/node-fs-extra)等第三方库实现 ，提前了解和学习这些知识会对使用本项目有很大的帮助。

### 文档说明

- [galaxy-cli-core 核心包](./packages/core/README.md)
- [galaxy-cli-utils 工具包](./packages/utils/README.md)

## 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request  

## 许可证

[MIT License](https://github.com/sankeyangshu/galaxy-cli/blob/master/LICENSE)

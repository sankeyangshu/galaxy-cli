<h1 align="center">
  <img src="https://raw.githubusercontent.com/sankeyangshu/sankeyangshu/master/image/logo-bai.png" width="80"/>
  <br>
  Galaxy-CLI
</h1>
<h4 align="center">一个用于快速生成各种前后端项目模版的脚手架</h4>

<p align="center">
  <img src="https://img.shields.io/badge/Node-16.0.0-green" alt="flask version" data-canonical-src="https://img.shields.io/badge/Node-16.0.0-green" style="max-width:100%;">
  <img src="https://img.shields.io/badge/license-MIT-lightgrey" alt="LISENCE" data-canonical-src="https://img.shields.io/badge/license-MIT-lightgrey" style="max-width:100%;">
</p>
<p align="center">
  <a href="#简介">简介</a>&nbsp;|&nbsp;<a href="#快速开始">快速开始</a>
</p>

---

## 简介

### 什么是 Galaxy-CLI ？

Galaxy-CLI 是一个用于快速生成各种**前后端项目模版**的脚手架。Galaxy-CLI 可以有效的帮助开发者节省每次从零构建一个完整的项目环境的时间，避免开发者重复性工作。

### 软件架构

```bash
├── .husky                     # Git Hook 工具
├── packages                   # npm包源代码
│   ├── core                   # Galaxy-cli核心包
│   ├── utils                  # Galaxy-cli工具包
├── scripts                    # 脚本执行文件
│   ├── preinstall             # 包管理工具安装脚本
├── .editorconfig              # 编辑相关配置
├── .eslintignore              # eslint忽略文件
├── .eslintrc.js               # eslint 配置
├── .gitignore                 # git忽略文件
├── .prettierrc                # prettier 配置
├── .prettierignore            # prettier忽略文件
├── commitlint.config.js       # 集成 commitlint 验证提交规范
├── tsconfig.root.json         # typescript 配置
├── pnpm-workspace.yaml        # pnpm Monorepo 配置文件
├── pnpm-lock.yaml             # 依赖包版本锁定文件
├── package.json               # package.json 依赖
```

## 快速开始

### 文档说明

- [galaxy-cli-core 核心包](./packages/core/README.md)
- [galaxy-cli-utils 工具包](./packages/utils/README.md)

### 前序准备

提前了解和学习这些知识会对使用本项目有很大的帮助。

- [node](http://nodejs.org/) 和 [git](https://git-scm.com/) - 项目开发环境
- [TypeScript](https://www.typescriptlang.org/) - 熟悉 `TypeScript` 基本语法
- [Es6+](http://es6.ruanyifeng.com/) - 熟悉 es6 基本语法
- [commander](https://github.com/tj/commander.js) - 熟悉 commander 基本使用
- [inquirer](https://github.com/SBoudrias/Inquirer.js) - inquirer 基本使用
- [fs-extra](https://github.com/jprichardson/node-fs-extra) - fs-extra 基本使用

## 安装和使用

- 获取代码

```bash
git clone https://github.com/sankeyangshu/galaxy-cli.git
```

- 安装依赖

```bash
cd galaxy-cli

# 推荐使用pnpm管理依赖，如果需要使用其他包管理工具，需要将package.json中`preinstall`删除
pnpm install
```

- 运行

```bash
cd packages/core

pnpm run dev
```

- 打包

```bash
cd packages/core

pnpm run build
```

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

'use strict';

const path = require('path');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const semver = require('semver');
const colors = require('colors/safe');
const gitclone = require('git-clone/promise');
const Command = require('../models/command');
const { log } = require('galaxy-cli-utils');
const { loading } = require('../utils/loading');
const { TEMPLATE_ARRAY } = require('../lib/const');
const { getGiteeRepo, getGithubRepo } = require('../utils/request');

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || '';
    this.force = !!this._cmd.force;
    log.verbose('projectName', this.projectName);
    log.verbose('force', this.force);
  }

  async exec() {
    try {
      // 1. 准备阶段
      const projectInfo = await this.prepare();
      if (projectInfo) {
        // 2. 下载模板
        log.verbose('projectInfo', projectInfo);
        const { projectName, projectVersion, projectDescribe, projectAuthor, projectTemplate } =
          projectInfo;
        const downloadPath = path.join(process.cwd(), projectName); // 项目创建位置
        await loading(
          '下载模版中，请等待一会',
          this.downloadTemplate,
          projectTemplate, // 模版链接
          downloadPath
        );

        // 3. 修改配置文件
        await loading(
          `生成 ${colors.yellow('package.json')} 等模板文件`,
          this.modifyPackageJson,
          downloadPath,
          {
            projectName,
            projectVersion,
            projectDescribe,
            projectAuthor,
          }
        );

        // 4. 模板使用提示
        console.log(`\r\n 项目创建成功 ${colors.cyan(projectName)}`);
        console.log(`\r\n  cd ${colors.cyan(projectName)}`);
        console.log('  npm install\r\n');
      }
    } catch (e) {
      log.error(e.message);
      if (process.env.LOG_LEVEL === 'verbose') {
        console.log(e);
      }
    }
  }

  async prepare() {
    // 获取当前工作目录
    const localPath = process.cwd();
    // 拼接得到项目目录
    const targetDirectory = path.join(localPath, this.projectName);
    // 判断目录是否存在
    if (fs.existsSync(targetDirectory)) {
      // 判断是否使用 --force 参数
      if (this.force) {
        // 给用户做二次确认
        const { confirmDelete } = await inquirer.prompt({
          type: 'confirm',
          name: 'confirmDelete',
          default: false,
          message: '是否确认删除同名目录文件？',
        });
        if (confirmDelete) {
          // 删除重名目录(remove是个异步方法)
          await fs.remove(targetDirectory);
        }
      } else {
        const { isOverwrite } = await inquirer.prompt([
          {
            name: 'isOverwrite',
            type: 'list',
            message: `目标文件夹 ${colors.cyan(targetDirectory)} 已经存在，请选择：`,
            choices: [
              { name: '覆盖', value: true },
              { name: '取消', value: false },
            ],
          },
        ]);
        // 选择 Cancel
        if (!isOverwrite) {
          console.log('Cancel');
          return;
        } else {
          // 选择 Overwirte ，先删除掉原有重名目录
          console.log(`\nRemoving ${colors.cyan(targetDirectory)}...`);
          await fs.remove(targetDirectory);
        }
      }
    }
    // 返回项目基本信息
    return this.getProjectInfo();
  }

  /**
   * @description: 下载模版
   * @param {string} templateGitUrl 模版路径
   * @param {string} downloadPath 下载路径
   * @return {Promise} 下载结果
   */
  async downloadTemplate(templateGitUrl, downloadPath) {
    // 下载模版
    await gitclone(templateGitUrl, downloadPath, { shallow: true });
    // 删除模版中的git文件
    fs.removeSync(path.join(downloadPath, '.git'));
  }

  /**
   * @description: 修改package.json文件
   * @param {string} downloadPath 下载路径
   * @param {Object} options 配置
   */
  async modifyPackageJson(downloadPath, options) {
    const packagePath = path.join(downloadPath, 'package.json');
    // 判定文件是否存在
    if (fs.existsSync(packagePath)) {
      const pkgJson = await fs.readJson(packagePath);
      const pkg = Object.assign(pkgJson, {
        name: options.projectName,
        version: options.projectVersion,
        description: options.projectDescribe,
        author: options.projectAuthor,
      });
      fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
    } else {
      throw new Error('没有找到 package.json');
    }
  }

  // 获取项目名称
  async getProjectInfo() {
    // 校验项目名称
    function isValidName(v) {
      return /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v);
    }

    let projectInfo = {};
    let isProjectNameValid = false;
    if (isValidName(this.projectName)) {
      isProjectNameValid = true;
      projectInfo.projectName = this.projectName;
    }
    // 创建项目-获取项目信息
    const projectNamePrompt = {
      type: 'input',
      name: 'projectName',
      message: `请输入项目名称`,
      default: '',
      validate: function (v) {
        const done = this.async();
        setTimeout(function () {
          // 1.首字符必须为英文字符
          // 2.尾字符必须为英文或数字，不能为字符
          // 3.字符仅允许"-_"
          if (!isValidName(v)) {
            done(`请输入合法的项目名称`);
            return;
          }
          done(null, true);
        }, 0);
      },
      filter: function (v) {
        return v;
      },
    };
    const projectPrompt = [];
    if (!isProjectNameValid) {
      projectPrompt.push(projectNamePrompt);
    }
    projectPrompt.push(
      {
        type: 'input',
        name: 'projectVersion',
        message: `请输入项目版本号`,
        default: '1.0.0',
        validate: function (v) {
          const done = this.async();
          setTimeout(function () {
            if (!semver.valid(v)) {
              done('请输入合法的版本号');
              return;
            }
            done(null, true);
          }, 0);
        },
        filter: function (v) {
          if (semver.valid(v)) {
            return semver.valid(v);
          } else {
            return v;
          }
        },
      },
      {
        type: 'input',
        name: 'projectDescribe',
        message: `请输入项目简介`,
        default: 'project created by galaxy-cli',
      },
      {
        type: 'input',
        name: 'projectAuthor',
        message: `请输入项目作者`,
        default: 'sankeyangshu',
      }
    );
    //  获取项目的基本信息
    const project = await inquirer.prompt(projectPrompt);
    // 选择模版源
    const templateSource = await this.getGitRegistry();
    // 获取模板信息及用户最终选择的模板
    const projectTemplate = await this.getRepoInfo(templateSource);
    // 返回项目基本信息
    projectInfo = {
      ...projectInfo,
      ...project,
      projectTemplate,
    };
    return projectInfo;
  }

  // 选择模版源
  async getGitRegistry() {
    const choices = [
      {
        name: 'Github（最新）',
        value: 'Github',
      },
      {
        name: 'Gitee（最快）',
        value: 'Gitee',
      },
    ];

    const { templateSource } = await inquirer.prompt([
      {
        type: 'list',
        name: 'templateSource',
        message: '请选择模板源',
        choices,
      },
    ]);

    return templateSource;
  }

  // 获取模板信息及用户最终选择的模板
  async getRepoInfo(gitRepo) {
    let repoList = [];
    // 判断从那个git仓库获取模版信息
    if (gitRepo === 'Github') {
      // 获取组织下的仓库信息
      repoList = await loading('正在拉取模版中...', getGithubRepo);
    } else if (gitRepo === 'Gitee') {
      repoList = await await loading('正在拉取模版中...', getGiteeRepo);
    }
    if (!repoList) return;
    // 提取仓库名
    const repos = repoList
      .map((item) => {
        if (gitRepo === 'Gitee') {
          return { name: item.name, value: item.html_url };
        }
        return { name: item.name, value: item.clone_url };
      })
      .filter((res) => TEMPLATE_ARRAY.includes(res.name));
    // 选取模板信息
    const { projectTemplate } = await inquirer.prompt([
      {
        name: 'projectTemplate',
        type: 'list',
        message: '请选择项目模版',
        choices: repos,
      },
    ]);
    return projectTemplate;
  }
}

async function init(projectName, cmdObj) {
  // console.log(projectName, cmdObj);
  return new InitCommand(Array.from([projectName, cmdObj]));
}

module.exports = init;
module.exports.InitCommand = InitCommand;

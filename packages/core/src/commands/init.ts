import { loading } from '../utils/loading.js';
import { TEMPLATE_ARRAY } from '../config/const.js';
import { getGiteeRepo, getGithubRepo } from '../utils/request.js';
import inquirer from 'inquirer';
import fse from 'fs-extra';
import semver from 'semver';
import chalk from 'chalk';
import ora from 'ora';
import Command from '../models/command.js';
import log from '../utils/log.js';
import download from 'download-git-repo';
import * as path from 'path';

class InitCommand extends Command {
  // 项目名称
  projectName: string;
  // 是否强制初始化项目
  force: boolean;

  init() {
    this.projectName = this._argv[0] || '';
    this.force = !!this._cmd.force;
    log.verbose('projectName', this.projectName);
    log.verbose('force', String(this.force));
  }

  async exec() {
    try {
      // 1. 准备阶段
      const projectInfo = await this.prepare();
      if (projectInfo) {
        // 2. 下载模板
        log.verbose('projectInfo', projectInfo);
        const {
          projectName,
          projectVersion,
          projectDescribe,
          projectAuthor,
          projectTemplate, // 模版链接
          templateSource,
        } = projectInfo;
        const downloadPath = path.join(process.cwd(), projectName); // 项目创建位置
        await this.downloadTemplate(projectTemplate, downloadPath, templateSource);
        // 3. 修改配置文件
        await this.modifyPackageJson(downloadPath, {
          projectName,
          projectVersion,
          projectDescribe,
          projectAuthor,
        });
        // 4. 模板使用提示
        // console.log(`\r\n 项目创建成功 ${chalk.cyan(projectName)}`);
        console.log(`\r\n  cd ${chalk.cyan(projectName)}`);
        console.log('  npm install\r\n');
      }
    } catch (e) {
      log.error('error', e.message);
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
    if (fse.existsSync(targetDirectory)) {
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
          await fse.remove(targetDirectory);
        }
      } else {
        const { isOverwrite } = await inquirer.prompt([
          {
            name: 'isOverwrite',
            type: 'list',
            message: `目标文件夹 ${chalk.cyan(targetDirectory)} 已经存在，请选择：`,
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
          console.log(`\nRemoving ${chalk.cyan(targetDirectory)}...`);
          await fse.remove(targetDirectory);
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
   * @param {string} templateSource 模板源
   * @return  下载结果
   */
  downloadTemplate(templateGitUrl: string, downloadPath: string, templateSource: string) {
    return new Promise<void>((resolve, reject) => {
      const spinner = ora(`正在从 ${templateSource} 拉取远程模板...`).start();
      // 下载模版
      download(`direct:${templateGitUrl}`, downloadPath, { clone: true }, async (error) => {
        if (error) {
          spinner.color = 'red';
          spinner.fail(chalk.red('拉取远程模板仓库失败！'));
          await fse.remove(downloadPath);
          return reject(error);
        }
        spinner.color = 'green';
        spinner.succeed(`${chalk.green('拉取远程模板仓库成功！')}`);
        // 删除模版中的git文件
        fse.removeSync(path.join(downloadPath, '.git'));
        resolve();
      });
    });
  }

  /**
   * @description: 修改package.json文件
   * @param {string} downloadPath 下载路径
   * @param {any} options 配置
   */
  async modifyPackageJson(downloadPath: string, options: any) {
    const spinner = ora(`正在创建项目...`).start();
    const packagePath = path.join(downloadPath, 'package.json');
    // 判定文件是否存在
    if (fse.existsSync(packagePath)) {
      const pkgJson = await fse.readJson(packagePath);
      const pkg = Object.assign(pkgJson, {
        name: options.projectName,
        version: options.projectVersion,
        description: options.projectDescribe,
        author: options.projectAuthor,
      });
      fse.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
      spinner.color = 'green';
      spinner.succeed(`${chalk.green('项目创建成功')} ${chalk.cyan(options.projectName)}`);
    } else {
      spinner.color = 'red';
      spinner.fail(chalk.red('项目创建失败！'));
      await fse.remove(downloadPath);
      throw new Error('没有找到 package.json');
    }
  }

  // 获取项目名称
  async getProjectInfo() {
    // 校验项目名称
    function isValidName(v: string) {
      return /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v);
    }

    let projectInfo: any = {};
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
      validate: function (v: string) {
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
      filter: function (v: string) {
        return v;
      },
    };
    const projectPrompt: any = [];
    if (!isProjectNameValid) {
      projectPrompt.push(projectNamePrompt);
    }
    projectPrompt.push(
      {
        type: 'input',
        name: 'projectVersion',
        message: `请输入项目版本号`,
        default: '1.0.0',
        validate: function (v: string) {
          const done = this.async();
          setTimeout(function () {
            if (!semver.valid(v)) {
              done('请输入合法的版本号');
              return;
            }
            done(null, true);
          }, 0);
        },
        filter: function (v: string) {
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
      templateSource,
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
  async getRepoInfo(gitRepo: string) {
    let repoList: any = [];
    // 判断从那个git仓库获取模版信息
    if (gitRepo === 'Github') {
      // 获取组织下的仓库信息
      repoList = await loading('正在获取模版信息...', getGithubRepo);
    } else if (gitRepo === 'Gitee') {
      repoList = await await loading('正在获取模版信息...', getGiteeRepo);
    }
    if (!repoList) return;
    // 提取仓库名
    const repos = repoList
      .filter((res: any) => TEMPLATE_ARRAY.includes(res.name))
      .map((item: any) => {
        if (gitRepo === 'Gitee') {
          return { name: `${item.name} ${item.description}`, value: item.html_url };
        }
        return { name: `${item.name} ${item.description}`, value: item.clone_url };
      });
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

function initCommand(projectName: string, cmdObj: { force: boolean }) {
  return new InitCommand(Array.from([projectName, cmdObj]));
}

async function init(projectName: string, cmdObj: { force: boolean }) {
  // console.log(projectName, cmdObj);
  initCommand(projectName, cmdObj);
}

export { init, InitCommand };

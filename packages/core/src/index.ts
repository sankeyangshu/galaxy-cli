import commander from 'commander';
import colors from 'colors/safe';
// import rootCheck from 'root-check';
import userHome from 'user-home';
import semver from 'semver';
import log from './utils/log';
import * as path from 'path';
import { pathExistsSync } from 'path-exists';
import { getPkgVersion, getPkgItemByKey, getNpmSemverVersion } from './utils';
import { DEFAULT_CLI_HOME } from './config/const';

// 初始化 commander
const program = new commander.Command();

// 获取npm版本
const pkgVersion = getPkgVersion();

/**
 * @description: 解析命令
 */
function registerCommand() {
  program
    .name(getPkgItemByKey('bin').galaxy)
    .usage('<command> [options]')
    .version(pkgVersion)
    .option('-d, --debug', '是否开启调试模式', false);

  // 命令注册
  // program.command('init [projectName]').option('-f, --force', '是否强制初始化项目').action(init);

  // 开启debug模式
  // program.on('option:debug', function () {
  //   if (program.debug) {
  //     process.env.LOG_LEVEL = 'verbose';
  //   } else {
  //     process.env.LOG_LEVEL = 'info';
  //   }
  //   log.level = process.env.LOG_LEVEL;
  // });

  // 对未知命令监听
  program.on('command:*', function (obj) {
    const availableCommands = program.commands.map((cmd) => cmd.name());
    console.log(colors.red('未知的命令：' + obj[0]));
    if (availableCommands.length > 0) {
      console.log(colors.red('可用命令：' + availableCommands.join(',')));
    }
  });

  program.parse(process.argv);

  // 判断是否需要打印帮助文档
  if (program.args && program.args.length < 1) {
    program.outputHelp();
    console.log();
  }
}

/**
 * @description: 检查版本号
 */
function checkPkgVersion() {
  log.info('cli', pkgVersion);
}

/**
 * @description: 检查用户主目录
 */
function checkUserHome() {
  if (!userHome || !pathExistsSync(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在！'));
  }
}

/**
 * @description: 创建默认的环境变量配置
 */
function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
    cliHome: '',
  };
  if (process.env.CLI_HOME) {
    cliConfig.cliHome = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig.cliHome = path.join(userHome, DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
}

/**
 * @description: 检查环境变量
 */
function checkEnv() {
  const dotenv = require('dotenv');
  const dotenvPath = path.resolve(userHome, '.env');
  if (pathExistsSync(dotenvPath)) {
    dotenv.config({
      path: dotenvPath,
    });
  }
  createDefaultConfig();
}

/**
 * @description: 检查全局版本是否需要更新
 */
async function checkGlobalUpdate() {
  // 1.获取当前版本号和模块名
  const currentVersion = pkgVersion;
  const npmName = getPkgItemByKey('name');
  // 2.调用npm API，获取最新的版本号
  const lastVersion = await getNpmSemverVersion(currentVersion, npmName);
  // 3.比对最新版本号是否大于当前版本号，并提示用户更新到该版本
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(
      '',
      colors.yellow(`请手动更新 ${npmName}，当前版本：${currentVersion}，最新版本：${lastVersion}
                更新命令： npm install -g ${npmName}`)
    );
  }
}

/**
 * @description: 准备阶段
 */
async function prepare() {
  checkPkgVersion();
  // rootCheck(); // 检查root账户
  checkUserHome();
  checkEnv();
  await checkGlobalUpdate();
}

/**
 * @description: 主方法
 */
async function core() {
  try {
    await prepare();
    registerCommand();
  } catch (e) {
    log.error('', e.message);
    // if (program.debug) {
    //   console.log(e);
    // }
  }
}

export default core;

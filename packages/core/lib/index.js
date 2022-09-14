'use strict';

const path = require('path');
const commander = require('commander');
const userHome = require('user-home');
const colors = require('colors/safe');
const pathExists = require('path-exists').sync;
const semver = require('semver');
const pkg = require('../package.json');
const constant = require('./const');
const { log, getNpmSemverVersion } = require('@galaxy-cli/utils');

const program = new commander.Command();

/**
 * @description: 解析命令
 */
function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', '');

  program.parse(process.argv);
}

/**
 * @description: 检查版本号
 */
function checkPkgVersion() {
  log.info('cli', pkg.version);
}

/**
 * @description: 检查root账户
 */
function checkRoot() {
  const rootCheck = require('root-check');
  rootCheck();
}

/**
 * @description: 检查用户主目录
 */
function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在！'));
  }
}

/**
 * @description: 检查环境变量
 */
function checkEnv() {
  const dotenv = require('dotenv');
  const dotenvPath = path.resolve(userHome, '.env');
  if (pathExists(dotenvPath)) {
    dotenv.config({
      path: dotenvPath,
    });
  }
  createDefaultConfig();
}

/**
 * @description: 创建默认的环境变量配置
 */
function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  };
  if (process.env.CLI_HOME) {
    cliConfig.cliHome = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig.cliHome = path.join(userHome, constant.DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
}

/**
 * @description: 检查全局版本是否需要更新
 */
async function checkGlobalUpdate() {
  // 1.获取当前版本号和模块名
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  // 2.调用npm API，获取最新的版本号
  const lastVersion = await getNpmSemverVersion(currentVersion, npmName);
  // 3.比对最新版本号是否大于当前版本号，并提示用户更新到该版本
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(
      colors.yellow(`请手动更新 ${npmName}，当前版本：${currentVersion}，最新版本：${lastVersion}
                更新命令： npm install -g ${npmName}`)
    );
  }
}

/**
 * @description: 主方法
 */
async function core() {
  try {
    checkPkgVersion();
    checkRoot();
    checkUserHome();
    checkEnv();
    await checkGlobalUpdate();
    registerCommand();
  } catch (e) {
    log.error(e.message);
  }
}

module.exports = core;

'use strict';

const commander = require('commander');
const pkg = require('../package.json');

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

function core() {
  registerCommand();
}

module.exports = core;

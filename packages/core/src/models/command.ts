import { LOWEST_NODE_VERSION } from '../config/const.js';
import semver from 'semver';
import chalk from 'chalk';
import log from '../utils/log.js';

export default class Command {
  // 输入的命令参数
  _argv: any;
  _cmd: any;

  constructor(argv: any[]) {
    // console.log(argv);
    this._argv = argv;
    this.runner();
  }

  runner() {
    try {
      this.checkNodeVersion();
      this.initArgs();
      this.init();
      this.exec();
    } catch (err) {
      log.error('error', err.message);
    }
  }

  // 检查node版本
  checkNodeVersion() {
    const currentVersion = process.version;
    const lowestVersion = LOWEST_NODE_VERSION;
    if (!semver.gte(currentVersion, lowestVersion)) {
      throw new Error(chalk.red(`galaxy-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`));
    }
  }

  initArgs() {
    this._cmd = this._argv[this._argv.length - 1];
    this._argv = this._argv.slice(0, this._argv.length - 1);
  }

  init() {
    throw new Error('init必须实现！');
  }

  exec() {
    throw new Error('exec必须实现！');
  }
}

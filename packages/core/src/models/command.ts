import { LOWEST_NODE_VERSION } from '../config/const';
import semver from 'semver';
import colors from 'colors/safe';
import log from '../utils/log';

export default class Command {
  _argv: any;
  _cmd: any;
  runner: any;

  constructor(argv) {
    // console.log(argv);
    this._argv = argv;

    this.runner = new Promise(() => {
      let chain = Promise.resolve();
      chain = chain.then(() => this.checkNodeVersion());
      chain = chain.then(() => this.initArgs());
      chain = chain.then(() => this.init());
      chain = chain.then(() => this.exec());
      chain.catch((err) => {
        log.error('error', err.message);
      });
    });
  }

  // 检查node版本
  checkNodeVersion() {
    const currentVersion = process.version;
    const lowestVersion = LOWEST_NODE_VERSION;
    if (!semver.gte(currentVersion, lowestVersion)) {
      throw new Error(colors.red(`galaxy-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`));
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

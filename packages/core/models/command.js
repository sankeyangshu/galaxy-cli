'use strict';

const semver = require('semver');
const colors = require('colors/safe');
const { log } = require('galaxy-cli-utils');
const { LOWEST_NODE_VERSION } = require('../lib/const');

class Command {
  constructor(argv) {
    // console.log(argv);
    this._argv = argv;
    // eslint-disable-next-line no-unused-vars
    const runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve();
      chain = chain.then(() => this.checkNodeVersion());
      chain = chain.then(() => this.initArgs());
      chain = chain.then(() => this.init());
      chain = chain.then(() => this.exec());
      chain.catch((err) => {
        log.error(err.message);
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

module.exports = Command;

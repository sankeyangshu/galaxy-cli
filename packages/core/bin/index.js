#! /usr/bin/env node

const importLocal = require('import-local');

if (importLocal(__filename)) {
  require('npmlog').info('cli', '正在使用 galaxy-cli 本地版本');
} else {
  require('../lib')(process.argv.slice(2));
}

// "axios": "^0.27.2",
//     "colors": "^1.4.0",
//     "commander": "^9.4.0",
//     "dotenv": "8.2.0",
//     "fs-extra": "^10.1.0",
//     "galaxy-cli-utils": "1.0.2",
//     "git-clone": "^0.2.0",
//     "import-local": "^3.1.0",
//     "inquirer": "7.3.3",
//     "npminstall": "4.10.0",
//     "npmlog": "^6.0.2",
//     "ora": "5.0.0",
//     "path-exists": "4.0.0",
//     "pkg-dir": "5.0.0",
//     "root-check": "1.0.0",
//     "semver": "^7.3.7",
//     "user-home": "^3.0.0"

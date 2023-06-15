#! /usr/bin/env node

import { filename } from 'dirname-filename-esm';
import importLocal from 'import-local';
import log from 'npmlog';
import entry from '../dist/index.js';

const __filename = filename(import.meta);

if (importLocal(__filename)) {
  log.info('cli', '正在使用 galaxy-cli 本地版本');
} else {
  entry(process.argv.slice(2));
}

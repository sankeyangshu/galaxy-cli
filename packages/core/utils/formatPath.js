'use strict';

const path = require('path');

/**
 * @description: 路径兼容(macOS/windows)
 * @param {*} p 路径
 * @return {*} 兼容结果
 */
module.exports = function formatPath(p) {
  if (p && typeof p === 'string') {
    const sep = path.sep;
    if (sep === '/') {
      return p;
    } else {
      return p.replace(/\\/g, '/');
    }
  }
  return p;
};

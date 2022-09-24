'use strict';

const ora = require('ora');

/**
 * 睡觉函数
 * @param {Number} n 睡眠时间
 */
function sleep(n) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, n);
  });
}

/**
 * loading加载效果
 * @param {String} message 加载信息
 * @param {Function} fn 加载函数
 * @param {List} args fn 函数执行的参数
 * @returns 异步调用返回值
 */
async function loading(message, fn, ...args) {
  const spinner = ora(message);
  spinner.start(); // 开启加载
  try {
    const executeRes = await fn(...args);
    spinner.succeed();
    return executeRes;
  } catch (error) {
    spinner.fail('请求失败，正在重试');
    await sleep(1000);
    return loading(message, fn, ...args);
  }
}

module.exports = {
  loading,
};

'use strict';

/**
 * @description: 判断变量是否为对象
 * @param {*} o 变量
 * @return {*} 判断结果
 */
function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

module.exports = {
  isObject,
};

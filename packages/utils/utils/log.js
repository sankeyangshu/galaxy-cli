/*
 * @Description: 日志输出方法
 * @Author: 三棵杨树
 * @Date: 2022-09-14 19:05:01
 * @LastEditors: 三棵杨树
 * @LastEditTime: 2022-09-14 19:15:41
 */

const log = require('npmlog');

log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'; // 判断debug模式

log.heading = 'galaxy'; // 修改前缀
log.addLevel('success', 2000, { fg: 'green', bold: true }); // 添加自定义命令

module.exports = log;

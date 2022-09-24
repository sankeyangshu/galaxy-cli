'use strict';

const axios = require('axios');

// 拦截全局请求响应
axios.interceptors.response.use((res) => {
  return res.data;
});

/**
 * @description: 获取github模板
 * @param {string} username 用户名称
 * @return {Promise} 仓库信息
 */
async function getGithubRepo(username = 'sankeyangshu') {
  return axios.get(`https://api.github.com/users/${username}/repos`);
}

/**
 * @description: 获取gitee模板
 * @param {string} username 用户名称
 * @return {Promise} 仓库信息
 */
async function getGiteeRepo(username = 'sankeyangshu') {
  return axios.get(`https://gitee.com/api/v5/users/${username}/repos?type=owner`);
}

module.exports = {
  getGithubRepo,
  getGiteeRepo,
};

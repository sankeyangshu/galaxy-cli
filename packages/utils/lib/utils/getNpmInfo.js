/*
 * @Description: 获取npm包信息
 * @Author: 三棵杨树
 * @Date: 2022-09-14 20:27:35
 * @LastEditors: 三棵杨树
 * @LastEditTime: 2022-09-14 20:56:57
 */

const axios = require('axios');
const urlJoin = require('url-join');
const semver = require('semver');

/**
 * @description: 获取npm包信息
 * @param {*} npmName npm包名称
 * @param {*} registry npm源
 * @return {*} npm包信息
 */
function getNpmInfo(npmName, registry) {
  if (!npmName) {
    return null;
  }
  const registryUrl = registry || getDefaultRegistry();
  const npmInfoUrl = urlJoin(registryUrl, npmName);
  return axios
    .get(npmInfoUrl)
    .then((res) => {
      if (res.status === 200) {
        return res.data;
      }
      return null;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

/**
 * @description: 获取默认的npm源
 * @param {*} isOriginal 是否是原生源
 * @return {*} npm源
 */
function getDefaultRegistry(isOriginal = false) {
  return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org';
}

/**
 * @description: 获取npm包版本
 * @param {*} npmName npm包名称
 * @param {*} registry npm源
 * @return {*} 版本数组
 */
async function getNpmVersions(npmName, registry) {
  const data = await getNpmInfo(npmName, registry);
  if (data) {
    return Object.keys(data.versions);
  } else {
    return [];
  }
}

/**
 * @description: 获取符合条件的版本号数组
 * @param {*} baseVersion 基础版本号
 * @param {*} versions npm包版本数组
 * @return {*} 符合条件的版本号数组
 */
function getSemverVersions(baseVersion, versions) {
  return versions
    .filter((version) => semver.satisfies(version, `>${baseVersion}`))
    .sort((a, b) => (semver.gt(b, a) ? 1 : -1));
}

/**
 * @description: 获取所有满足条件的版本号
 * @param {*} baseVersion 基础版本号
 * @param {*} npmName npm包名称
 * @param {*} registry npm源
 * @return {*} 版本数组
 */
async function getNpmSemverVersion(baseVersion, npmName, registry) {
  const versions = await getNpmVersions(npmName, registry);
  const newVersions = getSemverVersions(baseVersion, versions);
  if (newVersions && newVersions.length > 0) {
    return newVersions[0];
  }
  return null;
}

/**
 * @description: 获取最新版本号
 * @param {*} npmName npm包名称
 * @param {*} registry npm源
 * @return {*} 最新版本号
 */
async function getNpmLatestVersion(npmName, registry) {
  const versions = await getNpmVersions(npmName, registry);
  if (versions) {
    return versions.sort((a, b) => semver.gt(b, a))[0];
  }
  return null;
}

module.exports = {
  getNpmInfo,
  getDefaultRegistry,
  getNpmVersions,
  getNpmSemverVersion,
  getNpmLatestVersion,
};

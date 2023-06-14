import axios from 'axios';
import urlJoin from 'url-join';
import semver from 'semver';
import * as path from 'path';

/**
 * @description: 路径兼容(macOS/windows)
 * @param {any} p 路径
 * @return  兼容结果
 */
export function formatPath(p: any) {
  if (p && typeof p === 'string') {
    const sep = path.sep;
    if (sep === '/') {
      return p;
    } else {
      return p.replace(/\\/g, '/');
    }
  }
  return p;
}

/**
 * @description: 获取根路径
 * @return {string} 根路径
 */
export function getRootPath(): string {
  return path.resolve(__dirname, '../../');
}

/**
 * @description: 获取当前包版本号
 * @return {string} 版本号
 */
export function getPkgVersion(): string {
  return require(path.join(getRootPath(), 'package.json')).version;
}

/**
 * @description: 获取当前包配置
 * @param {string} key 配置关键词
 * @return 配置项
 */
export function getPkgItemByKey(key: string) {
  const packageMap = require(path.join(getRootPath(), 'package.json'));
  if (Object.keys(packageMap).indexOf(key) === -1) {
    return {};
  } else {
    return packageMap[key];
  }
}

/**
 * @description: 获取默认的npm源
 * @param {boolean} isOriginal 是否是原生源
 * @return npm源
 */
export function getDefaultRegistry(isOriginal = false) {
  return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org';
}

/**
 * @description: 获取npm包信息
 * @param {string} npmName npm包名称
 * @param {string} registry npm源
 * @return  npm包信息
 */
export function getNpmInfo(npmName: string, registry?: string) {
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
 * @description: 获取npm包版本
 * @param {string} npmName npm包名称
 * @param {string} registry npm源
 * @return {Promise<string[]>} 版本数组
 */
export async function getNpmVersions(npmName: string, registry?: string) {
  const data = await getNpmInfo(npmName, registry);
  if (data) {
    return Object.keys(data.versions);
  } else {
    return [];
  }
}

/**
 * @description: 获取符合条件的版本号数组
 * @param {string} baseVersion 基础版本号
 * @param {string[]} versions npm包版本数组
 * @return {*} 符合条件的版本号数组
 */
function getSemverVersions(baseVersion: string, versions: string[]) {
  return versions
    .filter((version) => semver.satisfies(version, `>${baseVersion}`))
    .sort((a, b) => (semver.gt(b, a) ? 1 : -1));
}

/**
 * @description: 获取所有满足条件的版本号
 * @param {string} baseVersion 基础版本号
 * @param {string} npmName npm包名称
 * @param {string} registry npm源
 * @return 版本数组
 */
export async function getNpmSemverVersion(baseVersion: string, npmName: string, registry?: string) {
  const versions = await getNpmVersions(npmName, registry);
  const newVersions = getSemverVersions(baseVersion, versions);
  if (newVersions && newVersions.length > 0) {
    return newVersions[0];
  }
  return null;
}

/**
 * @description: 获取最新版本号
 * @param {string} npmName npm包名称
 * @param {string} registry npm源
 * @return  最新版本号
 */
export async function getNpmLatestVersion(npmName: string, registry?: string) {
  const versions = await getNpmVersions(npmName, registry);
  if (versions) {
    return versions.sort((a, b) => (semver.gt(b, a) ? 1 : -1))[0];
  }
  return null;
}

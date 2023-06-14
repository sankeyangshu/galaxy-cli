import { pathExistsSync } from 'path-exists';
import { packageDirectorySync } from 'pkg-dir';
import { formatPath, getDefaultRegistry, getNpmLatestVersion } from '../utils';
import { isObject } from '../utils/is';
import npminstall from 'npminstall';
import fse from 'fs-extra';
import * as path from 'path';

class Package {
  // package的路径
  targetPath: string;
  // package的缓存路径
  storeDir: string;
  // package Name
  packageName: string;
  // package Version
  packageVersion: string | null;
  // package的缓存目录前缀
  cacheFilePathPrefix: string;

  constructor(options) {
    if (!options) {
      throw new Error('Package类的options参数不能为空！');
    }
    if (!isObject(options)) {
      throw new Error('Package类的options参数必须为对象！');
    }
    // package的路径
    this.targetPath = options.targetPath;
    // package的缓存路径
    this.storeDir = options.storeDir;
    // package Name
    this.packageName = options.packageName;
    // package Version
    this.packageVersion = options.packageVersion;
    // package的缓存目录前缀
    this.cacheFilePathPrefix = this.packageName.replace('/', '_');
  }

  async prepare() {
    if (this.storeDir && !pathExistsSync(this.storeDir)) {
      fse.mkdirpSync(this.storeDir);
    }
    if (this.packageVersion === 'latest') {
      this.packageVersion = await getNpmLatestVersion(this.packageName);
    }
  }

  // 获取缓存路径前缀
  get cacheFilePath() {
    return path.resolve(
      this.storeDir,
      `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`
    );
  }

  // 获取最新版本号路径前缀
  getSpecificCacheFilePath(packageVersion) {
    return path.resolve(
      this.storeDir,
      `_${this.cacheFilePathPrefix}@${packageVersion}@${this.packageName}`
    );
  }

  // 判定当前pakcage是否存在
  async exists() {
    if (this.storeDir) {
      await this.prepare();
      return pathExistsSync(this.cacheFilePath);
    } else {
      return pathExistsSync(this.targetPath);
    }
  }

  // 安装Package
  install() {
    npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: getDefaultRegistry(),
      pkgs: [
        {
          name: this.packageName,
          version: this.packageVersion,
        },
      ],
    });
  }

  // 更新Package
  async update() {
    await this.prepare();
    // 1. 获取最新的npm模块版本号
    const latestPackageVersion = await getNpmLatestVersion(this.packageName);
    // 2. 查询最新版本号对应的路径是否存在
    const latestFilePath = this.getSpecificCacheFilePath(latestPackageVersion);
    // 3. 如果不存在，则直接安装最新版本
    if (!pathExistsSync(latestFilePath)) {
      await npminstall({
        root: this.targetPath,
        storeDir: this.storeDir,
        registry: getDefaultRegistry(),
        pkgs: [
          {
            name: this.packageName,
            version: latestPackageVersion,
          },
        ],
      });
      this.packageVersion = latestPackageVersion;
    } else {
      this.packageVersion = latestPackageVersion;
    }
  }

  // 获取入口文件路径
  getRootFilePath() {
    // 1. 获取package.json所在目录
    const dir = packageDirectorySync({ cwd: this.targetPath });
    if (dir) {
      // 2. 读取package.json
      const pkgFile = require(path.resolve(dir, 'package.json'));
      // 3. 寻找main/lib
      if (pkgFile && pkgFile.main) {
        // 4. 路径的兼容(macOS/windows)
        return formatPath(path.resolve(dir, pkgFile.main));
      }
    }
    return null;
  }
}

export default Package;

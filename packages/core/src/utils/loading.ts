import ora from 'ora';

/**
 * @description: 睡觉函数
 * @param {number} n 睡眠时间
 */
function sleep(n: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, n);
  });
}

/**
 * @description: loading加载效果
 * @param {string} message 加载信息
 * @param {Function} fn 加载函数
 * @param {array} args n 函数执行的参数
 * @return 异步调用返回值
 */
export async function loading(message: string, fn: Function, ...args: any[]) {
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

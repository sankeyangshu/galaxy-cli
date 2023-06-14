const toString = Object.prototype.toString;

/**
 * 数据类型
 */
export enum DataType {
  Object = 'Object',
  Array = 'Array',
  Date = 'Date',
  RegExp = 'RegExp',
  Function = 'Function',
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  Undefined = 'Undefined',
  Null = 'Null',
  Symbol = 'Symbol',
  Set = 'Set',
  Map = 'Map',
  Promise = 'Promise',
  Window = 'Window',
  AsyncFunction = 'AsyncFunction',
}

export type _DataType = keyof typeof DataType;

/**
 * @description: 判断值是否为某个类型
 * @param {unknown} val 值
 * @param {_DataType} type 类型
 * @return  判断结果
 */
export const is = (val: unknown, type: _DataType) => {
  return toString.call(val) === `[object ${type}]`;
};

/**
 * @description: 是否为对象
 * @param {any} val 值
 * @return 判断结果
 */
export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, 'Object');
};

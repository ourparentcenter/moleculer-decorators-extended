/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const getTag = (value: any) => {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  return toString.call(value);
};

const isObject = (value: any) => {
  const type = typeof value;
  return value != null && ['object', 'function'].includes(type);
};

const omit = (object: any, remove: string[]) => {
  const newObj = { ...object };
  for (const n of remove) {
    delete newObj[n];
  }
  return newObj;
};

const isFunction = (value: any) => {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  return ['[object Function]', '[object AsyncFunction]', '[object GeneratorFunction]', '[object Proxy]'].includes(getTag(value));
};
export { omit, isFunction };

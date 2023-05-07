'use strict';

const getArgKey = (arg) => arg.toString() + ':' + typeof(arg);
const generateKey = (args) => args.map(getArgKey).join('|');

export const memoize = (fn) => {
  const cache = Object.create(null);
  return (...args) => {
    const key = generateKey(args);
    const value = cache[key];
    if (value) return value;
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
};

/* eslint-disable @typescript-eslint/no-unsafe-return */
/**
 * Abstract the calls incase the Reflect library changes or a different one is better
 */
import 'reflect-metadata';

import { META_PREFIX } from '../constants';

function prefixKey(key: string): string {
  if (typeof key === 'string' && key.startsWith(META_PREFIX as string) === false) {
    return `${META_PREFIX}${key}`;
  }

  return key;
}

export const getMetadataKeys = (target: object): any[] => {
  const keys: any[] = Reflect.getMetadataKeys(target) || [];
  return keys.filter((key: string) => key.toString().startsWith(META_PREFIX as string));
};

export const getMetadata = (target: object, key: string) => {
  const prefixedKey: string = prefixKey(key);
  // const data = Reflect.getMetadata(prefixedKey, target);
  // return data;
  return Reflect.getMetadata(prefixedKey, target);
};

export const removeMetadata = (target: object, key: string) => {
  const prefixedKey: string = prefixKey(key);
  return Reflect.deleteMetadata(prefixedKey, target);
};

export const setMetadata = (target: object, key: string, value: any) => {
  const prefixedKey: string = prefixKey(key);
  Reflect.defineMetadata(prefixedKey, value, target);
};

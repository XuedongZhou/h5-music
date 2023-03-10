import { storage } from './storage';

export type compareFunc<T> = (value: T, index: number, obj: T[]) => unknown;

function inertArray<T>(
  arr: Array<T>,
  val: T,
  compare: (value: T, index: number, obj: T[]) => unknown,
  maxLen: number
) {
  const index = arr.findIndex(compare);
  if (index === 0) {
    return;
  }
  if (index > 0) {
    arr.splice(index, 1);
  }
  arr.unshift(val);
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}

function deleteFromArray<T>(arr: Array<T>, compare: compareFunc<T>) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

export function save<T>(item: T, key: string, compare: compareFunc<T>, maxLen: number) {
  const items = storage.get(key, []);
  inertArray(items, item, compare, maxLen);
  storage.set(key, items);
  return items;
}

export function remove<T>(key: string, compare: compareFunc<T>) {
  const items = storage.get(key, []);
  deleteFromArray(items, compare);
  storage.set(key, items);
  return items;
}

export function load(key: string) {
  return storage.get(key, []);
}

export function clear(key: string) {
  storage.remove(key);
  return [];
}

export function saveAll<T>(items: Array<T>, key: string) {
  storage.set(key, items);
}

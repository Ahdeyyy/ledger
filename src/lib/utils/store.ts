import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Account } from './types';
import type { Writable } from 'svelte/store';

type AccountStore = Writable<string>;
type AccountMap = Map<string, Account>;

const emptyMap: AccountMap = new Map();

export const accounts: AccountStore = localStorageStore('account', MapToString(emptyMap));


export function MapToString(map: AccountMap): string {
  return JSON.stringify(Array.from(map.entries()));
}

export function StringToMap(str: string): AccountMap {
    return new Map(JSON.parse(str));
}
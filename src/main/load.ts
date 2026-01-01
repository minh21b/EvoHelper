import path from 'path';
import fs from 'fs/promises';
import { IClassLoad } from '../types';

const extractItem = (str: string, key: string, end = '" )'): string => {
  if (str.indexOf(key) === -1 || str.indexOf(end) === -1) {
    return '';
  }
  const item = str
    .slice(
      // 10 is a 'magic' number to cut color code before name
      // |cff8B4513Scepter of Mastery    <--- example of the name
      str.indexOf(key) + key.length + 10,
      str.indexOf(end, str.indexOf(key) + 1),
    )
    .trim();

  if (item.endsWith('|r')) {
    return item.slice(0, item.length - 2);
  }

  return item;
};

const extractKey = (str: string, key: string, end = '"'): string => {
  if (str.indexOf(key) === -1 || str.indexOf(end) === -1) {
    return '';
  }
  return str.slice(
    str.indexOf(key) + key.length,
    str.indexOf(end, str.indexOf(key) + 1),
  );
};

const parseClassFile = (str: string): IClassLoad => {
  return {
    hero: extractKey(str, 'Hero: ', '"'),
    gold: extractKey(str, 'Gold: ', '"'),
    powerShards: extractKey(str, 'Shard: ', '"'),
    notes: extractKey(str, 'Mysterious Notes: '),
    sigils: extractKey(str, 'Mysterious Sigils: '),
    orbs: extractKey(str, 'Mysterious Orbs: '),
    code: extractKey(str, '"-l ', '"'),
    inventory: [...Array(6)].map((_, index) => {
      return extractItem(str, `"Item ${index + 1}: `).trim();
    }),
    stashes: [...Array(6)].map((_, stashIndex) => {
      return [...Array(6)].map((__, index) => {
        return extractItem(
          str,
          `"Stash${stashIndex ? stashIndex + 1 : ''} Item ${index + 1}: `,
        ).trim();
      });
    }),
  };
};
const loadClass = async (p: string) => {
  try {
    const classDir = await fs.readdir(p);
    const name = classDir
      .filter((el) => el.indexOf('[Level ') !== -1)
      .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
      .pop();

    if (!name) {
      return null;
    }

    const classFile = await fs.readFile(
      path.join(p, name),
      'utf-8'
    );

    return Object.assign(parseClassFile(classFile), {
      level: name?.slice(7, name && name.length ? name.length - 5 : 0),
    });
  } catch (e) {
    // If we failed for ANY reason - dont panic. 
    // nulls are filtered down the line
    return null;
  }
};

export const loadTevefAccount = async (p: Array<string>) => {
  const potentialClasses = await fs.readdir(path.join(...p));

  const res = await Promise.all(
    potentialClasses.map((cl) => loadClass(path.join(...p, cl))),
  );
  return res.filter(e => !!e)

};

export const loadTevefData = async (p: string[]) => {
  let potentialAccounts = await fs.readdir(path.join(...p));
  potentialAccounts = potentialAccounts.filter(account => account.indexOf('#') !== -1);

  let res: any = {};
  for (const account of potentialAccounts) {
    const data = await loadTevefAccount([...p, account])
    if (data) {
      res[account] = data;
    }
  }

  return res;
};



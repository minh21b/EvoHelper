import { TItem} from '../../types';

const normalize = (s:string) => 
  s.trim().toLowerCase()

export type HeroInfo = {
  baseClass?: string;
  tags: string[];
  equipAll?: boolean;
}

export const HERO_MAP:  Record<string, HeroInfo> = {
  'avenger': {baseClass: 'swordsman', tags: ['melee', 'tank']},
  'champion': {baseClass: 'swordsman', tags: ['melee', 'tank']},

  'white wizard': {baseClass: 'initiate', tags: ['intelligence']},
  'arch sage': {baseClass: 'initiate', tags: ['intelligence']},

  'sniper': {baseClass: 'archer', tags: ['archer']},
  'monster hunter': {baseClass: 'archer', tags: ['archer']},

  'phantom assassin': {baseClass: 'thief', tags: ['agility', 'melee']},
  'master stalker': {baseClass: 'thief', tags: ['agility', 'melee']},

  'grand templar': {baseClass: 'templar', tags: ['intelligence','high templar']},
  'dark arch templar': {baseClass: 'templar', tags: ['agility', 'melee']},

  'hierophant': {baseClass: 'acolyte', tags: ['intelligence']},
  'prophetess': {baseClass: 'acolyte', tags: ['intelligence']},

  'professional witcher': {baseClass: 'witchhunter', tags: ['agility', 'melee']},
  'grand inquisitor': {baseClass: 'witchhunter', tags: ['melee', 'inquisitor']},

  'summoner': {baseClass: 'druid', tags: ['intelligence']},
  'runemaster': {baseClass: 'druid', tags: ['intelligence', 'shapeshifter', 'tank']},

  'jounin': {baseClass: 'ninja', tags: ['agility', 'melee']},
  'annihilator': {baseClass: 'ninja', tags: ['melee', 'agility']},

  'sky sorceress': {baseClass: 'caster', tags: ['intelligence']},
  'lightbinder': {baseClass: 'caster', tags: ['intelligence']},

  'stargazer': {baseClass: 'fairy', tags: ['intelligence']},
  'mystic': {baseClass: 'fairy', tags: ['intelligence']},

  'demon incarnate': {baseClass: 'demon', tags: ['demon'], equipAll: true},

  'valkyrie': {baseClass: 'guardian', tags: ['melee', 'tank']},
  'paladin': {baseClass: 'guardian', tags: ['melee']},

  'rhapsody': {baseClass: 'bard', tags: ['intelligence']},
  'mythsong': {baseClass: 'bard', tags: ['intelligence']},
};

export const RESTRICTION_NAME_TO_ID: Record<string, number> = {
  "all classes": 0,
  "forge material": 1,
  "forging material": 11,
  "melee classes only": 2,
  "melee agility classes only": 3,
  "intelligence classes only": 4,
  "druid class only": 5,
  "swordsman class only": 6,
  "archer class only": 7,
  "chunin class only": 8,
  "shapeshifter class only": 9,
  "inquisitor class only": 10,
  "high templar class only": 12,
  "acolyte, caster, fairy class only": 13,
  "tank classes only": 14,
  "ultimate forge material": 15,
  "noble class only": 17,
  "fairy class only": 18,
  "demon incarnate class only": 19,
  "templar class only": 20,
  "caster class only": 21,
  "thief class only": 22,
  "witch hunter class only": 23,
  "initiate class only": 24,
  "acolyte class only": 25,
  "ninja class only": 26,
  "profession item": 27,
  "acolyte, caster class only": 28,
  "bard only": 29,
  "inquisitor, guardian class only": 30,
};


export const RESTRICTION_RULES: Record<number, (info: HeroInfo)=> boolean> = {
  0: () => true, //all classes
  2: info => info.tags.includes('melee'),
  3: info => info.tags.includes('melee') && info.tags.includes('agility'),
  4: info => info.tags.includes('intelligence'),
  5: info => info.baseClass === 'druid',
  6: info => info.baseClass === 'swordsman',
  7: info => info.baseClass === 'archer',
  8: info => info.baseClass === 'chunin',
  9: info => info.tags.includes('shapeshifter'),
  10: info => info.tags.includes('inquisitor'),
  12: info => info.tags.includes('grand templar'),
  13: info => ['acolyte', 'caster', 'fairy'].includes(info.baseClass?? ''),
  14: info => info.tags.includes('tank'),
  17: info => info.baseClass === 'noble',
  18: info => info.baseClass === 'fairy',
  19: info => info.baseClass === 'demon',
  20: info => info.baseClass === 'templar',
  21: info => info.baseClass === 'caster',
  22: info => info.baseClass === 'thief',
  23: info => info.baseClass === 'witchhunter',
  24: info => info.baseClass === 'initiate',
  25: info => info.baseClass === 'acolyte',
  26: info => info.baseClass === 'ninja',
  28: info => ['acolyte', 'caster'].includes(info.baseClass ??  ''),
  29: info => info.baseClass === 'bard',
  30: info => ['inquisitor', 'guardian'].includes(info.baseClass ?? ''),
};

export function canEquipItem(hero: string, item: TItem): boolean {
  const heroKey = normalize(hero);
  const heroInfo = HERO_MAP[heroKey];

  if (!heroInfo) return false;

  if (heroInfo.equipAll) return true;

  const restrictionName = normalize(String(item.restriction));
  const restrictionId = RESTRICTION_NAME_TO_ID[restrictionName];

  if (restrictionId === undefined) {
    console.log("Restriction not found in map:", item.name, item.restriction);
    return false;
  }

  const rule = RESTRICTION_RULES[restrictionId];
  return rule ? rule(heroInfo) : false;
}
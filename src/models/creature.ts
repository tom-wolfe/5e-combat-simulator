import { AbilityScores, Action, DamageType } from '@sim/models';

export type CreatureType = 'player' | 'monster';

export interface CreatureModel {
  name: string,
  type: CreatureType,
  ac: number,
  actions: Action[];
  hp?: number;
  maxHp: number,
  legendary?: Legendary;
  regeneration?: number;
  alterations?: DamageTypeAlteration[];
  spellSlots?: SpellSlots
  initiativeMod: number;
  initiative?: number;
  saves: AbilityScores;
}

export interface Legendary {
  resistances: number;
  maxActions: number;
  actions: number;
}

export type DamageAlteration = 'resistant' | 'vulnerable' | 'immune';

export interface DamageTypeAlteration {
  alteration: DamageAlteration;
  type: DamageType;
  mundaneOnly?: boolean;
}

export interface SpellSlots {
  1?: number;
  2?: number;
  3?: number;
  4?: number;
  5?: number;
  6?: number;
  7?: number;
  8?: number;
  9?: number;
}

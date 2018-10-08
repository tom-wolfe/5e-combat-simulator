import { AbilityScores, Action, DamageType } from '@sim/models';

export type CreatureType = 'player' | 'monster';

export interface Creature {
  name: string,
  type: CreatureType,
  ac: number,
  actions: Action[];
  hp?: number;
  maxHp: number,
  legendary?: Legendary;
  alterations?: DamageTypeAlteration[];
  initiativeMod: number;
  initiative?: number;
  saves: AbilityScores;
}

export interface Legendary {
  resistances: number;
  maxActions: number;
  actions: number;
}

// TODO: Add spell slots.

export type DamageAlteration = 'resistant' | 'vulnerable' | 'immune';

export interface DamageTypeAlteration {
  alteration: DamageAlteration;
  type: DamageType;
  mundaneOnly?: boolean;
}

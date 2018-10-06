import { AbilityScores, Action, DamageType } from '@sim/models';

export type CreatureType = 'player' | 'monster';

export interface Creature {
  name: string,
  type: CreatureType,
  ac: number,
  actions: Action[];
  hp?: number;
  maxHp: number,
  alterations?: DamageTypeAlteration[];
  initiativeMod: number;
  initiative?: number;
  saves: AbilityScores;
}

// TODO: Add spell slots.

export type DamageAlteration = 'resistant' | 'vulnerable' | 'immune';

export interface DamageTypeAlteration {
  alteration: DamageAlteration;
  type: DamageType;
  mundaneOnly?: boolean;
}

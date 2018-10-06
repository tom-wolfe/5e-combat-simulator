import { AbilityScores, Action } from '@sim/models';

export type CreatureType = 'player' | 'monster';

export interface Creature {
  name: string,
  type: CreatureType,
  ac: number,
  actions: Action[];
  hp?: number;
  maxHp: number,
  initiativeMod: number;
  initiative?: number;
  saves: AbilityScores;
}

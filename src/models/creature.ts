import { Action } from '@sim/models/action';

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
}

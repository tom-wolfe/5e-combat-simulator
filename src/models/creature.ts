import { DamageRoll } from '@sim/models/damage';

export type CreatureType = 'player' | 'monster';

export interface Creature {
  name: string,
  type: CreatureType,
  ac: number,
  damage: DamageRoll;
  toHit: number,
  maxHp: number,
  initiativeMod: number;
}

export interface EncounterCreature extends Creature {
  initiative: number;
  hp: number;
}

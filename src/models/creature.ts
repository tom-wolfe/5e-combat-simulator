import { DiceFunction } from '../dice';

export type CreatureType = 'player' | 'monster';

export interface Creature {
  name: string,
  type: CreatureType,
  ac: number,
  damage: (d: DiceFunction) => number;
  toHit: number,
  maxHp: number,
  initiativeBonus: number;
}

export interface EncounterCreature extends Creature {
  initiative: number;
  hp: number;
}

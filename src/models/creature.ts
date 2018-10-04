export type CreatureType = 'player' | 'monster';

export interface Creature {
  name: string,
  type: CreatureType,
  ac: number,
  damage: string;
  toHit: number,
  maxHp: number,
  initiativeBonus: number;
}

export interface EncounterCreature extends Creature {
  initiative: number;
  hp: number;
}

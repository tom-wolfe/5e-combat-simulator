import { Creature, DamageRoll, Encounter, RollDice, TargettedAction } from '@sim/models';

export type Approach = 'offensive' | 'defensive';

export type CriticalStrategy = (damage: DamageRoll, roll: RollDice) => number;
export type ApproachStrategy = (current: Creature, encounter: Encounter) => Approach;
export type OffensiveStrategy = (current: Creature, encounter: Encounter) => TargettedAction;
export type DefensiveStrategy = (current: Creature, encounter: Encounter) => TargettedAction;

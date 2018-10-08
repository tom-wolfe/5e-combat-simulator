import { Creature, DamageRoll, Encounter, RollDice, TargettedAction, Action } from '@sim/models';

export type Approach = 'offensive' | 'defensive';

export type DiceStrategy = (damage: DamageRoll, roll: RollDice) => number;
export type ApproachStrategy = (current: Creature, encounter: Encounter) => Approach;
export type ActionStrategy = (current: Creature, actions: Action[], targets: Creature[], encounter: Encounter) => TargettedAction;

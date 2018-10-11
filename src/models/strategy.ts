import { Action, DamageRoll, EncounterStrategy, RollDice, TargetedAction } from '@sim/models';
import { Creature } from '@sim/simulation/creature';

export type Approach = 'offensive' | 'defensive';

export type DiceStrategy = (damage: DamageRoll, roll: RollDice) => number;
export type ApproachStrategy = (current: Creature, strategy: EncounterStrategy) => Approach;
export type ActionStrategy = (current: Creature, actions: Action[], targets: Creature[], strategy: EncounterStrategy) => TargetedAction;

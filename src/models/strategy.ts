import { CreatureModel, DamageRoll, EncounterModel, RollDice, TargetedAction, Action } from '@sim/models';

export type Approach = 'offensive' | 'defensive';

export type DiceStrategy = (damage: DamageRoll, roll: RollDice) => number;
export type ApproachStrategy = (current: CreatureModel, encounter: EncounterModel) => Approach;
export type ActionStrategy = (
  current: CreatureModel, actions: Action[], targets: CreatureModel[], encounter: EncounterModel) => TargetedAction;

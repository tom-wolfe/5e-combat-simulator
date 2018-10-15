import { ActionModel, TargetedAction } from '@sim/action';
import { Creature } from '@sim/creature';
import { EncounterStrategy } from '@sim/encounter';

export type ActionStrategy = (
  current: Creature,
  actions: ActionModel[],
  targets: Creature[],
  strategy: EncounterStrategy
) => TargetedAction;

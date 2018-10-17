import { Action, TargetedAction } from '@sim/action';
import { Creature } from '@sim/creature';
import { Encounter } from '@sim/encounter';

export type ActionStrategy = (
  current: Creature,
  actions: Action[],
  targets: Creature[],
  encounter: Encounter
) => TargetedAction;

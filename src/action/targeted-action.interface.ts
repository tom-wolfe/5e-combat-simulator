import { Creature } from '@sim/creature';
import { Action } from './action.class';

export interface TargetedAction {
  action: Action;
  targets: Creature[];
}
